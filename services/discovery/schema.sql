-- Schéma "discovery" — projet Supabase dixipolis-dev (LGX Development), appliqué le 13/09/2026
-- via migrations "create_discovery_schema" et "discovery_export_to_public".
-- Ce fichier est la copie de référence ; toute modification passe par une nouvelle migration.

create schema if not exists discovery;

create table discovery.persons (
  id serial primary key,
  person_id integer references public.persons(id),          -- référentiel Loïc (speaker resolution)
  display_name text not null unique,
  aliases text[] not null default '{}',
  party text, role text,
  tier smallint not null default 1,                         -- 1 candidat/figure majeure, 2 figure de parti, 3 élargi
  status_2027 text,                                         -- declare | pressenti | non_candidat
  youtube_channel_id text, youtube_channel_title text,
  active boolean not null default true, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table discovery.channels (
  youtube_channel_id text primary key,
  title text,
  kind text not null check (kind in ('person','party','institution','media','other')),
  uploads_playlist_id text generated always as ('UU' || substr(youtube_channel_id, 3)) stored,
  person_id integer references discovery.persons(id),
  in_daily_subscriptions boolean not null default false,    -- suivie par le compte YouTube du pipeline quotidien
  public_channel_id integer references public.youtube_channels(id),
  priority smallint not null default 2, active boolean not null default true,
  scanned_from timestamptz, scanned_to timestamptz, last_scanned_at timestamptz,
  videos_seen integer not null default 0, videos_matched integer not null default 0, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table discovery.videos (
  youtube_video_id text primary key,
  url text generated always as ('https://www.youtube.com/watch?v=' || youtube_video_id) stored,
  title text not null, description text, tags text[],
  channel_youtube_id text references discovery.channels(youtube_channel_id), channel_title text,
  published_at timestamptz, duration_sec integer, live_broadcast text, default_audio_language text, category_id text,
  view_count bigint, like_count bigint, has_captions boolean, thumbnail_url text,
  matched_person_ids integer[] not null default '{}', matched_names text[] not null default '{}',
  match_sources text[] not null default '{}',               -- own_channel | party_title | media_title | media_description | media_tags | search
  relevance_score numeric(4,3), relevance_reason text, scored_by text, scored_at timestamptz,
  status text not null default 'candidate' check (status in ('candidate','relevant','rejected','exported','ingested')),
  public_video_id integer references public.youtube_videos(id), exported_at timestamptz,
  first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now(),
  raw jsonb, updated_at timestamptz not null default now()
);
create index videos_status_idx on discovery.videos (status);
create index videos_published_idx on discovery.videos (published_at);
create index videos_channel_idx on discovery.videos (channel_youtube_id);
create index videos_matched_gin on discovery.videos using gin (matched_person_ids);

create table discovery.harvest_runs (
  id bigserial primary key, started_at timestamptz not null default now(), finished_at timestamptz,
  source text not null, channel_youtube_id text, query text, window_from timestamptz, window_to timestamptz,
  api_units integer not null default 0, pages integer not null default 0,
  videos_seen integer not null default 0, videos_new integer not null default 0, videos_matched integer not null default 0,
  status text not null default 'running' check (status in ('running','done','failed','partial')), error text, notes text
);
create index harvest_runs_channel_idx on discovery.harvest_runs (channel_youtube_id, window_from, window_to);

create table discovery.quota_ledger (
  day date not null, api_key_label text not null default 'harvester',
  units_used integer not null default 0, units_limit integer not null default 10000,
  updated_at timestamptz not null default now(), primary key (day, api_key_label)
);

create or replace function discovery.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger persons_updated_at  before update on discovery.persons  for each row execute function discovery.set_updated_at();
create trigger channels_updated_at before update on discovery.channels for each row execute function discovery.set_updated_at();
create trigger videos_updated_at   before update on discovery.videos   for each row execute function discovery.set_updated_at();

-- Vue consommée par la pipeline d'ingestion : même forme que public.youtube_videos
create or replace view discovery.v_ready_for_ingestion as
select v.youtube_video_id, v.title, v.description, v.duration_sec as duration, v.published_at, v.url,
       array_to_string(v.tags, ', ') as tags, v.channel_youtube_id, v.channel_title, c.public_channel_id,
       v.matched_person_ids,
       (select array_agg(p.person_id) from discovery.persons p where p.id = any(v.matched_person_ids) and p.person_id is not null) as matched_public_person_ids,
       v.matched_names, v.relevance_score, v.status
  from discovery.videos v
  left join discovery.channels c on c.youtube_channel_id = v.channel_youtube_id
 where v.status = 'relevant' and v.public_video_id is null
   and not exists (select 1 from public.youtube_videos y where y.youtube_video_id = v.youtube_video_id);

-- Rapprochement avec ce qui est déjà ingéré
create or replace function discovery.sync_ingested() returns integer language plpgsql as $$
declare n integer;
begin
  update discovery.videos v set public_video_id = y.id,
         status = case when v.status in ('candidate','relevant','exported') then 'ingested' else v.status end
    from public.youtube_videos y where y.youtube_video_id = v.youtube_video_id and v.public_video_id is distinct from y.id;
  get diagnostics n = row_count; return n;
end $$;

-- Export vers les tables de Loïc (idempotent) : select * from discovery.export_to_public(200);
create or replace function discovery.export_to_public(p_limit integer default 100)
returns table (exported integer, channels_created integer) language plpgsql as $$
declare v_exported integer := 0; v_channels integer := 0;
begin
  with missing as (
    select distinct v.channel_youtube_id, coalesce(v.channel_title, c.title) as title
      from discovery.v_ready_for_ingestion v left join discovery.channels c on c.youtube_channel_id = v.channel_youtube_id
     where v.channel_youtube_id is not null and not exists (select 1 from public.youtube_channels y where y.youtube_id = v.channel_youtube_id)
  ), ins as (insert into public.youtube_channels (platform_id, title, youtube_id, active) select 1, title, channel_youtube_id, true from missing returning id)
  select count(*) into v_channels from ins;
  update discovery.channels c set public_channel_id = y.id from public.youtube_channels y where y.youtube_id = c.youtube_channel_id and c.public_channel_id is null;
  with batch as (select v.* from discovery.v_ready_for_ingestion v order by v.relevance_score desc nulls last, v.published_at desc limit p_limit),
  ins as (
    insert into public.youtube_videos (title, description, duration, published_at, url, youtube_channel_id, tags, youtube_video_id)
    select b.title, b.description, b.duration, b.published_at::timestamp, b.url, y.id, nullif(b.tags, ''), b.youtube_video_id
      from batch b left join public.youtube_channels y on y.youtube_id = b.channel_youtube_id
    returning id, youtube_video_id)
  update discovery.videos d set status = 'ingested', public_video_id = ins.id, exported_at = now() from ins where ins.youtube_video_id = d.youtube_video_id;
  get diagnostics v_exported = row_count;
  return query select v_exported, v_channels;
end $$;

alter table discovery.persons enable row level security;
alter table discovery.channels enable row level security;
alter table discovery.videos enable row level security;
alter table discovery.harvest_runs enable row level security;
alter table discovery.quota_ledger enable row level security;
