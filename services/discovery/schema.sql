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

-- ===== Fonctions (état courant, exporté depuis la base le 2026-09-13) =====
-- RPC public.discovery_* : appelées par les relais n8n (jeton discovery.settings.relay_token)

-- discovery.export_to_public
CREATE OR REPLACE FUNCTION discovery.export_to_public(p_limit integer DEFAULT NULL::integer)
 RETURNS TABLE(exported integer, channels_created integer)
 LANGUAGE plpgsql
AS $function$
declare v_exported integer := 0; v_channels integer := 0;
begin
  with missing as (
    select distinct v.channel_youtube_id, coalesce(v.channel_title, c.title) as title
      from discovery.v_ready_for_ingestion v left join discovery.channels c on c.youtube_channel_id = v.channel_youtube_id
     where v.channel_youtube_id is not null and not exists (select 1 from public.youtube_channels y where y.youtube_id = v.channel_youtube_id)
  ), ins as (insert into public.youtube_channels (platform_id, title, youtube_id, active) select 1, title, channel_youtube_id, true from missing returning id)
  select count(*) into v_channels from ins;
  update discovery.channels c set public_channel_id = y.id from public.youtube_channels y where y.youtube_id = c.youtube_channel_id and c.public_channel_id is null;
  with batch as (
    select v.* from discovery.v_ready_for_ingestion v
     order by v.tier nulls last, v.relevance_score desc nulls last, v.published_at desc
     limit coalesce(p_limit, 2147483647)
  ), ins as (
    insert into public.youtube_videos (title, description, duration, published_at, url, youtube_channel_id, tags, youtube_video_id)
    select b.title, b.description, b.duration, b.published_at::timestamp, b.url, y.id, nullif(b.tags, ''), b.youtube_video_id
      from batch b left join public.youtube_channels y on y.youtube_id = b.channel_youtube_id
    returning id, youtube_video_id)
  update discovery.videos d set status = 'ingested', public_video_id = ins.id, exported_at = now() from ins where ins.youtube_video_id = d.youtube_video_id;
  get diagnostics v_exported = row_count;
  return query select v_exported, v_channels;
end $function$;

-- discovery.sync_ingested
CREATE OR REPLACE FUNCTION discovery.sync_ingested()
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare n integer;
begin
  update discovery.videos v
     set public_video_id = y.id,
         status = case when v.status in ('candidate','relevant','exported') then 'ingested' else v.status end
    from public.youtube_videos y
   where y.youtube_video_id = v.youtube_video_id
     and v.public_video_id is distinct from y.id;
  get diagnostics n = row_count;
  return n;
end $function$;

-- public.discovery_apply_scores
CREATE OR REPLACE FUNCTION public.discovery_apply_scores(p_token text, p_scores jsonb, p_model text DEFAULT 'gpt-4o-mini'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'discovery'
AS $function$
declare v_token text; n_rel integer := 0; n_rej integer := 0; n_grey integer := 0;
begin
  select value into v_token from discovery.settings where key = 'relay_token';
  if v_token is null or p_token is distinct from v_token then raise exception 'unauthorized' using errcode = '28000'; end if;

  with s as (
    select x.video_id, coalesce(x.speakers, '{}') as speakers, least(1, greatest(0, coalesce(x.score, 0))) as score, x.reason
      from jsonb_to_recordset(p_scores) as x(video_id text, speakers text[], score numeric, reason text)
  ), sp as (
    select s.video_id, s.score, s.reason, s.speakers,
           (select coalesce(array_agg(p.id), '{}') from discovery.persons p where p.display_name = any(s.speakers)) as speaker_ids
      from s
  ), upd as (
    update discovery.videos v
       set relevance_score = sp.score,
           relevance_reason = left(sp.reason, 500),
           scored_by = 'llm:' || p_model,
           scored_at = now(),
           matched_names = case when cardinality(sp.speaker_ids) > 0 then sp.speakers else v.matched_names end,
           matched_person_ids = case when cardinality(sp.speaker_ids) > 0 then sp.speaker_ids else v.matched_person_ids end,
           status = case when v.status <> 'candidate' then v.status
                         when sp.score >= 0.7 and cardinality(sp.speaker_ids) > 0 then 'relevant'
                         when sp.score < 0.4 or cardinality(sp.speaker_ids) = 0 then 'rejected'
                         else 'candidate' end
      from sp where sp.video_id = v.youtube_video_id
    returning v.status
  )
  select count(*) filter (where status = 'relevant'), count(*) filter (where status = 'rejected'), count(*) filter (where status = 'candidate')
    into n_rel, n_rej, n_grey from upd;
  return jsonb_build_object('relevant', n_rel, 'rejected', n_rej, 'grey', n_grey);
end $function$;

-- public.discovery_fetch_to_score
CREATE OR REPLACE FUNCTION public.discovery_fetch_to_score(p_token text, p_limit integer DEFAULT 100)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'discovery'
AS $function$
declare v_token text; v_out jsonb;
begin
  select value into v_token from discovery.settings where key = 'relay_token';
  if v_token is null or p_token is distinct from v_token then raise exception 'unauthorized' using errcode = '28000'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
           'video_id', v.youtube_video_id, 'title', v.title, 'description', left(coalesce(v.description,''), 700),
           'tags', (select string_agg(t, ', ') from unnest(v.tags[1:25]) t), 'channel', v.channel_title, 'channel_kind', c.kind,
           'duration_min', round(v.duration_sec / 60.0), 'published_at', to_char(v.published_at, 'YYYY-MM-DD'),
           'matched_names', v.matched_names)), '[]'::jsonb)
    into v_out
    from (select * from discovery.videos v0 where v0.status = 'candidate' and v0.scored_by = 'rule'
           order by v0.relevance_score desc, v0.published_at desc limit greatest(1, least(p_limit, 500))) v
    left join discovery.channels c on c.youtube_channel_id = v.channel_youtube_id;
  return v_out;
end $function$;

-- public.discovery_ops
CREATE OR REPLACE FUNCTION public.discovery_ops(p_token text, p_action text, p_args jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'discovery'
AS $function$
declare v_token text; v_out jsonb; v_n integer;
begin
  select value into v_token from discovery.settings where key = 'relay_token';
  if v_token is null or p_token is distinct from v_token then raise exception 'unauthorized' using errcode = '28000'; end if;

  if p_action = 'status' then
    select jsonb_build_object(
      'today', current_date,
      'quota', (select coalesce(jsonb_agg(jsonb_build_object('day', q.day, 'units', q.units_used) order by q.day), '[]') from discovery.quota_ledger q where q.day >= current_date - 7),
      'units_today', (select coalesce(sum(q.units_used), 0) from discovery.quota_ledger q where q.day = current_date),
      'videos_by_status', (select jsonb_object_agg(s.status, s.cnt) from (select status, count(*) as cnt from discovery.videos group by status) s),
      'hours_relevant', (select round(sum(duration_sec)/3600.0) from discovery.videos where status = 'relevant'),
      'to_score', (select count(*) from discovery.videos where status = 'candidate' and scored_by = 'rule'),
      'ready_for_ingestion', (select count(*) from discovery.v_ready_for_ingestion),
      'ingested', (select count(*) from discovery.videos where status = 'ingested'),
      'persons', (select jsonb_build_object('total', count(*), 'active', count(*) filter (where active), 'with_channel', count(*) filter (where youtube_channel_id like 'UC%')) from discovery.persons),
      'runs_24h', (select count(*) from discovery.harvest_runs where started_at > now() - interval '24 hours'),
      'last_report', (select jsonb_build_object('day', r.day, 'summary', r.summary) from discovery.daily_reports r order by r.created_at desc limit 1)
    ) into v_out;
    return v_out;

  elsif p_action = 'coverage' then
    select coalesce(jsonb_agg(jsonb_build_object('channel', c.youtube_channel_id, 'title', c.title, 'kind', c.kind, 'priority', c.priority,
             'active', c.active, 'from', c.scanned_from, 'to', c.scanned_to, 'seen', c.videos_seen, 'matched', c.videos_matched) order by c.kind, c.priority, c.title), '[]')
      into v_out from discovery.channels c
     where (p_args->>'kind' is null or c.kind = p_args->>'kind')
       and (p_args->>'priority' is null or c.priority = (p_args->>'priority')::int);
    return v_out;

  elsif p_action = 'registry' then
    select jsonb_build_object(
      'persons', (select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name, 'aliases', p.aliases, 'youtube_channel_id', p.youtube_channel_id, 'tier', p.tier) order by p.id), '[]') from discovery.persons p where p.active),
      'channels', (select coalesce(jsonb_agg(jsonb_build_object('youtube_channel_id', c.youtube_channel_id, 'kind', c.kind, 'person_id', c.person_id, 'priority', c.priority, 'title', c.title) order by c.kind, c.priority, c.title), '[]') from discovery.channels c where c.active)
    ) into v_out;
    return v_out;

  elsif p_action = 'sync_ingested' then
    v_n := discovery.sync_ingested();
    return jsonb_build_object('synced', v_n);

  elsif p_action = 'set_channel_active' then
    update discovery.channels set active = coalesce((p_args->>'active')::boolean, false), notes = coalesce(p_args->>'notes', notes)
     where youtube_channel_id = p_args->>'channel';
    get diagnostics v_n = row_count; return jsonb_build_object('updated', v_n);

  elsif p_action = 'add_channel' then
    insert into discovery.channels (youtube_channel_id, title, kind, priority, person_id, notes)
    values (p_args->>'channel', p_args->>'title', coalesce(p_args->>'kind', 'media'), coalesce((p_args->>'priority')::int, 3),
            (p_args->>'person_id')::int, p_args->>'notes')
    on conflict (youtube_channel_id) do update set title = coalesce(excluded.title, discovery.channels.title),
      kind = excluded.kind, priority = least(discovery.channels.priority, excluded.priority),
      person_id = coalesce(excluded.person_id, discovery.channels.person_id), active = true;
    return jsonb_build_object('ok', true);

  elsif p_action = 'add_person' then
    insert into discovery.persons (display_name, aliases, party, role, tier, youtube_channel_id, youtube_channel_title, person_id)
    values (p_args->>'display_name',
            coalesce((select array_agg(x) from jsonb_array_elements_text(coalesce(p_args->'aliases', '[]'::jsonb)) x), '{}'),
            p_args->>'party', p_args->>'role', coalesce((p_args->>'tier')::int, 3), p_args->>'youtube_channel_id', p_args->>'youtube_channel_title',
            (select pp.id from public.persons pp where lower(pp.display_name) = lower(p_args->>'display_name') limit 1))
    on conflict (display_name) do update set aliases = excluded.aliases, tier = least(discovery.persons.tier, excluded.tier),
      youtube_channel_id = coalesce(excluded.youtube_channel_id, discovery.persons.youtube_channel_id), active = true;
    insert into discovery.channels (youtube_channel_id, title, kind, priority, person_id)
    select p.youtube_channel_id, p.youtube_channel_title, 'person', 1, p.id from discovery.persons p
     where p.display_name = p_args->>'display_name' and p.youtube_channel_id like 'UC%'
    on conflict (youtube_channel_id) do update set person_id = excluded.person_id, kind = 'person';
    return (select jsonb_build_object('id', p.id, 'person_id', p.person_id, 'linked', p.person_id is not null) from discovery.persons p where p.display_name = p_args->>'display_name');

  elsif p_action = 'report' then
    insert into discovery.daily_reports (units_used, summary, details)
    values ((p_args->>'units_used')::int, p_args->>'summary', p_args->'details');
    return jsonb_build_object('ok', true);

  elsif p_action = 'sql_read' then
    if p_args->>'query' !~* '^\s*select' or p_args->>'query' ~* '(insert|update|delete|drop|alter|create|grant|truncate|;)' then
      raise exception 'read_only_select_only';
    end if;
    execute format('select coalesce(jsonb_agg(t), ''[]'') from (%s limit 500) t', p_args->>'query') into v_out;
    return v_out;
  end if;

  raise exception 'unknown_action %', p_action;
end $function$;

-- public.discovery_upsert_videos
CREATE OR REPLACE FUNCTION public.discovery_upsert_videos(p_token text, p_items jsonb, p_run jsonb DEFAULT NULL::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'discovery'
AS $function$
declare
  v_token text;
  n_ins integer := 0;
  n_upd integer := 0;
  v_run_id bigint;
begin
  select value into v_token from discovery.settings where key = 'relay_token';
  if v_token is null or p_token is distinct from v_token then
    raise exception 'unauthorized' using errcode = '28000';
  end if;

  if p_items is not null and jsonb_typeof(p_items) = 'array' and jsonb_array_length(p_items) > 0 then
    -- chaînes inconnues (référence obligatoire pour discovery.videos.channel_youtube_id)
    insert into discovery.channels (youtube_channel_id, title, kind, priority)
    select distinct on (i->>'channel_youtube_id') i->>'channel_youtube_id', i->>'channel_title', 'media', 3
      from jsonb_array_elements(p_items) i
     where coalesce(i->>'channel_youtube_id','') <> ''
    on conflict (youtube_channel_id) do nothing;

    with src as (
      select * from jsonb_to_recordset(p_items) as x(
        youtube_video_id text, title text, description text, tags text[], channel_youtube_id text, channel_title text,
        published_at timestamptz, duration_sec integer, live_broadcast text, default_audio_language text, category_id text,
        view_count bigint, like_count bigint, has_captions boolean, thumbnail_url text,
        matched_person_ids integer[], matched_names text[], match_sources text[],
        relevance_score numeric, relevance_reason text, scored_by text, status text, raw jsonb)
    ), ins as (
      insert into discovery.videos (youtube_video_id, title, description, tags, channel_youtube_id, channel_title, published_at,
        duration_sec, live_broadcast, default_audio_language, category_id, view_count, like_count, has_captions, thumbnail_url,
        matched_person_ids, matched_names, match_sources, relevance_score, relevance_reason, scored_by, status, raw)
      select youtube_video_id, coalesce(title, '(sans titre)'), left(description, 5000), tags, nullif(channel_youtube_id,''), channel_title, published_at,
        duration_sec, live_broadcast, default_audio_language, category_id, view_count, like_count, has_captions, thumbnail_url,
        coalesce(matched_person_ids, '{}'), coalesce(matched_names, '{}'), coalesce(match_sources, '{}'),
        relevance_score, relevance_reason, scored_by, coalesce(status, 'candidate'), raw
      from src where youtube_video_id is not null
      on conflict (youtube_video_id) do update set
        last_seen_at = now(),
        title = excluded.title,
        description = coalesce(excluded.description, discovery.videos.description),
        tags = coalesce(excluded.tags, discovery.videos.tags),
        duration_sec = coalesce(excluded.duration_sec, discovery.videos.duration_sec),
        view_count = coalesce(excluded.view_count, discovery.videos.view_count),
        like_count = coalesce(excluded.like_count, discovery.videos.like_count),
        raw = coalesce(excluded.raw, discovery.videos.raw),
        matched_person_ids = (select coalesce(array_agg(distinct x), '{}') from unnest(discovery.videos.matched_person_ids || excluded.matched_person_ids) x),
        matched_names = (select coalesce(array_agg(distinct x), '{}') from unnest(discovery.videos.matched_names || excluded.matched_names) x),
        match_sources = (select coalesce(array_agg(distinct x), '{}') from unnest(discovery.videos.match_sources || excluded.match_sources) x),
        relevance_score = case when discovery.videos.scored_by like 'llm%' or discovery.videos.scored_by = 'human'
                              then discovery.videos.relevance_score
                              else greatest(discovery.videos.relevance_score, excluded.relevance_score) end,
        relevance_reason = case when discovery.videos.scored_by like 'llm%' or discovery.videos.scored_by = 'human'
                               then discovery.videos.relevance_reason else coalesce(excluded.relevance_reason, discovery.videos.relevance_reason) end,
        status = case when discovery.videos.status in ('ingested','exported','relevant','rejected') then discovery.videos.status else excluded.status end
      returning (xmax = 0) as inserted
    )
    select count(*) filter (where inserted), count(*) filter (where not inserted) into n_ins, n_upd from ins;
  end if;

  if p_run is not null then
    insert into discovery.harvest_runs (started_at, finished_at, source, channel_youtube_id, query, window_from, window_to,
                                        api_units, pages, videos_seen, videos_new, videos_matched, status, error, notes)
    values (coalesce((p_run->>'started_at')::timestamptz, now()), now(), coalesce(p_run->>'source','unknown'),
            p_run->>'channel_youtube_id', p_run->>'query', (p_run->>'window_from')::timestamptz, (p_run->>'window_to')::timestamptz,
            coalesce((p_run->>'api_units')::int, 0), coalesce((p_run->>'pages')::int, 0), coalesce((p_run->>'videos_seen')::int, 0),
            n_ins, coalesce((p_run->>'videos_matched')::int, 0), coalesce(p_run->>'status','done'), p_run->>'error', p_run->>'notes')
    returning id into v_run_id;

    insert into discovery.quota_ledger (day, api_key_label, units_used)
    values (current_date, 'harvester', coalesce((p_run->>'api_units')::int, 0))
    on conflict (day, api_key_label) do update
      set units_used = discovery.quota_ledger.units_used + excluded.units_used, updated_at = now();

    if p_run->>'channel_youtube_id' is not null and p_run->>'window_from' is not null then
      update discovery.channels c
         set scanned_from = least(coalesce(c.scanned_from, (p_run->>'window_from')::timestamptz), (p_run->>'window_from')::timestamptz),
             scanned_to = greatest(coalesce(c.scanned_to, (p_run->>'window_to')::timestamptz), (p_run->>'window_to')::timestamptz),
             last_scanned_at = now(),
             videos_seen = c.videos_seen + coalesce((p_run->>'videos_seen')::int, 0),
             videos_matched = c.videos_matched + coalesce((p_run->>'videos_matched')::int, 0)
       where c.youtube_channel_id = p_run->>'channel_youtube_id';
    end if;
  end if;

  return jsonb_build_object('inserted', n_ins, 'updated', n_upd, 'run_id', v_run_id);
end
$function$;

