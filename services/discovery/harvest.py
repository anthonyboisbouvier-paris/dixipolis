#!/usr/bin/env python3
"""
Dixipolis — harvester YouTube pour la reprise historique ciblée (schéma discovery).

Boîte à outils déterministe pilotée par l'agent : chaque commande fait UNE chose,
compte les unités de quota consommées et écrit ses résultats en JSONL + SQL
(upserts vers discovery.videos / discovery.harvest_runs / discovery.quota_ledger).

Coûts YouTube Data API v3 (unités) : playlistItems.list 1 · videos.list 1 (50 ids)
· channels.list 1 · search.list 100.

Commandes :
  uploads   --channel UC... --from 2025-01-01 --to 2026-09-13 [--max-pages N]
            → JSONL des vidéos de la playlist d'uploads dans la fenêtre
  details   --ids-file ids.txt            → JSONL videos.list complet (50 ids/appel)
  search    --q "Bardella interview" --from --to [--max-pages N]  → JSONL search.list (100 u/page)
  channel   --handle @Bruno_Retailleau    → id UC... (channels.list forHandle, 1 u)
  match     --persons persons.json --channels channels.json --in videos.jsonl
            → JSONL enrichi (matched_person_ids, matched_names, match_sources, rule score)
  to-sql    --in matched.jsonl            → SQL d'upsert prêt pour execute_sql
  push      --in matched.jsonl [--run '{json}'] → envoi par lots au relais n8n (DISCOVERY_RELAY_TOKEN)
  score     --limit 50 --rounds N          → qualification LLM (gpt-4o-mini via n8n) des candidates de chaînes tierces
  ops       --action status|coverage|sync_ingested|set_channel_active|add_channel|add_person|report [--args '{json}'] | --sql 'select …'
  registry                                → régénère registry_persons.* / registry_channels.* depuis la base

Aucune dépendance hors bibliothèque standard. Clé : variable YOUTUBE_API_KEY.
"""
import argparse, json, os, re, sys, time, unicodedata, urllib.parse, urllib.request
from datetime import datetime, timezone

API = "https://www.googleapis.com/youtube/v3/"
COST = {"playlistItems": 1, "videos": 1, "channels": 1, "search": 100}
QUOTA = {"units": 0, "calls": 0}


# ----------------------------------------------------------------------------- HTTP
def api(resource, **params):
    key = os.environ.get("YOUTUBE_API_KEY")
    if not key:
        sys.exit("YOUTUBE_API_KEY manquante")
    params["key"] = key
    url = API + resource + "?" + urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                QUOTA["units"] += COST[resource]; QUOTA["calls"] += 1
                return json.load(r)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            if e.code in (403, 429) and "quota" in body.lower():
                sys.exit(f"QUOTA ÉPUISÉE ({e.code}) après {QUOTA['units']} unités : {body[:200]}")
            if e.code == 404:
                return {"items": [], "error": body[:200]}
            if attempt == 3 or e.code < 500:
                sys.exit(f"HTTP {e.code} sur {resource}: {body[:300]}")
        except (urllib.error.URLError, TimeoutError):
            if attempt == 3:
                raise
        time.sleep(2 ** attempt)


def iso(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")) if s else None


def day(s, end=False):
    d = datetime.fromisoformat(s)
    if d.tzinfo is None:
        d = d.replace(tzinfo=timezone.utc)
    return d


# ----------------------------------------------------------------------------- commandes
def cmd_uploads(a):
    """Parcourt la playlist d'uploads d'une chaîne (ordre ≈ anté-chronologique) dans [from, to[."""
    playlist = "UU" + a.channel[2:]
    lo, hi = day(a.frm), day(a.to)
    token, pages, seen, kept, older_streak = None, 0, 0, 0, 0
    out = open(a.out, "a", encoding="utf-8")
    while True:
        r = api("playlistItems", part="snippet,contentDetails", playlistId=playlist, maxResults=50, pageToken=token)
        pages += 1
        for it in r.get("items", []):
            seen += 1
            vid = it["snippet"].get("resourceId", {}).get("videoId")
            pub = iso(it.get("contentDetails", {}).get("videoPublishedAt") or it["snippet"].get("publishedAt"))
            if not vid or not pub:
                continue
            if pub < lo:
                older_streak += 1
                continue
            older_streak = 0
            if pub >= hi:
                continue
            kept += 1
            out.write(json.dumps({
                "youtube_video_id": vid, "title": it["snippet"].get("title"),
                "description": it["snippet"].get("description"),
                "channel_youtube_id": it["snippet"].get("videoOwnerChannelId") or it["snippet"].get("channelId"),
                "channel_title": it["snippet"].get("videoOwnerChannelTitle") or it["snippet"].get("channelTitle"),
                "published_at": pub.isoformat(), "source": "playlist", "source_channel": a.channel,
            }, ensure_ascii=False) + "\n")
        token = r.get("nextPageToken")
        # arrêt : plus de page, plafond, ou 100 vidéos d'affilée plus vieilles que la fenêtre
        if not token or pages >= a.max_pages or older_streak >= 100:
            break
    report(a, source="playlist", channel=a.channel, pages=pages, seen=seen, kept=kept)


def cmd_details(a):
    ids = [l.strip() for l in open(a.ids_file) if l.strip()]
    out = open(a.out, "a", encoding="utf-8")
    got = 0
    for i in range(0, len(ids), 50):
        r = api("videos", part="snippet,contentDetails,statistics,status,liveStreamingDetails", id=",".join(ids[i:i + 50]), maxResults=50)
        for v in r.get("items", []):
            got += 1
            sn, cd, st = v.get("snippet", {}), v.get("contentDetails", {}), v.get("statistics", {})
            out.write(json.dumps({
                "youtube_video_id": v["id"], "title": sn.get("title"), "description": sn.get("description"),
                "tags": sn.get("tags") or [], "channel_youtube_id": sn.get("channelId"), "channel_title": sn.get("channelTitle"),
                "published_at": sn.get("publishedAt"), "duration_sec": parse_duration(cd.get("duration")),
                "live_broadcast": sn.get("liveBroadcastContent"), "default_audio_language": sn.get("defaultAudioLanguage") or sn.get("defaultLanguage"),
                "category_id": sn.get("categoryId"), "view_count": int(st.get("viewCount", 0) or 0), "like_count": int(st.get("likeCount", 0) or 0),
                "has_captions": cd.get("caption") == "true",
                "thumbnail_url": (sn.get("thumbnails", {}).get("medium") or sn.get("thumbnails", {}).get("default") or {}).get("url"),
                "raw": v,
            }, ensure_ascii=False) + "\n")
    report(a, source="videos_list", pages=(len(ids) + 49) // 50, seen=len(ids), kept=got)


def cmd_search(a):
    token, pages, seen = None, 0, 0
    out = open(a.out, "a", encoding="utf-8")
    while True:
        r = api("search", part="snippet", q=a.q, type="video", maxResults=50, order="date",
                relevanceLanguage="fr", regionCode="FR", safeSearch="none",
                publishedAfter=day(a.frm).isoformat().replace("+00:00", "Z"),
                publishedBefore=day(a.to).isoformat().replace("+00:00", "Z"), pageToken=token)
        pages += 1
        for it in r.get("items", []):
            seen += 1
            out.write(json.dumps({
                "youtube_video_id": it["id"]["videoId"], "title": it["snippet"].get("title"),
                "description": it["snippet"].get("description"), "channel_youtube_id": it["snippet"].get("channelId"),
                "channel_title": it["snippet"].get("channelTitle"), "published_at": it["snippet"].get("publishedAt"),
                "source": "search", "source_query": a.q,
            }, ensure_ascii=False) + "\n")
        token = r.get("nextPageToken")
        if not token or pages >= a.max_pages:
            break
    report(a, source="search", query=a.q, pages=pages, seen=seen, kept=seen)


def cmd_channel(a):
    r = api("channels", part="snippet,statistics,contentDetails", forHandle=a.handle.lstrip("@"))
    for c in r.get("items", []):
        print(json.dumps({"youtube_channel_id": c["id"], "title": c["snippet"]["title"], "handle": a.handle,
                          "videos": c.get("statistics", {}).get("videoCount"), "subs": c.get("statistics", {}).get("subscriberCount")}, ensure_ascii=False))
    report(a, source="channels_list", query=a.handle, pages=1, seen=len(r.get("items", [])), kept=len(r.get("items", [])))


# ----------------------------------------------------------------------------- matching
def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s)


def cmd_match(a):
    persons = json.load(open(a.persons))       # [{id, display_name, aliases[], youtube_channel_id}]
    channels = {c["youtube_channel_id"]: c for c in json.load(open(a.channels))}  # {id: {kind, person_id}}
    pats = [(p, [re.compile(r"\b" + re.escape(norm(al).strip()) + r"\b") for al in [p["display_name"]] + p.get("aliases", [])]) for p in persons]
    out = open(a.out, "w", encoding="utf-8")
    n_in = n_match = 0
    for line in open(a.inp, encoding="utf-8"):
        v = json.loads(line); n_in += 1
        t, d, g = norm(v.get("title")), norm(v.get("description")), norm(" ".join(v.get("tags") or []))
        ch = channels.get(v.get("channel_youtube_id") or "", {})
        ids, names, sources = [], [], set()
        for p, regs in pats:
            hit_t = any(r.search(t) for r in regs); hit_d = any(r.search(d) for r in regs); hit_g = any(r.search(g) for r in regs)
            own = ch.get("person_id") == p["id"] or v.get("channel_youtube_id") == p.get("youtube_channel_id")
            if own or hit_t or hit_d or hit_g:
                ids.append(p["id"]); names.append(p["display_name"])
                if own: sources.add("own_channel")
                if hit_t: sources.add("media_title" if ch.get("kind") in (None, "media", "other") else ch["kind"] + "_title")
                if hit_d: sources.add("media_description")
                if hit_g: sources.add("media_tags")
        if not ids:
            continue
        n_match += 1
        # score de règle : probabilité qu'une personne ciblée PARLE (affiné ensuite par le LLM sur la bande grise)
        score = 0.9 if "own_channel" in sources else 0.75 if any(s.endswith("_title") for s in sources) else 0.5 if "media_description" in sources else 0.4
        status, reason = "candidate", None   # les shorts sont conservés (décision du 13/09) ; pas de rejet sur la durée
        v.update({"matched_person_ids": ids, "matched_names": names, "match_sources": sorted(sources),
                  "relevance_score": score, "scored_by": "rule", "status": status, "relevance_reason": reason})
        out.write(json.dumps(v, ensure_ascii=False) + "\n")
    print(f"match: {n_in} vidéos lues, {n_match} avec au moins une personne ciblée", file=sys.stderr)


# ----------------------------------------------------------------------------- SQL
def q(s):
    return "NULL" if s is None else "'" + str(s).replace("'", "''") + "'"


def arr(a, typ="text"):
    return "ARRAY[" + ",".join(q(x) if typ == "text" else str(int(x)) for x in (a or [])) + "]::" + typ + "[]"


def cmd_to_sql(a):
    rows = []
    for line in open(a.inp, encoding="utf-8"):
        v = json.loads(line)
        rows.append("(" + ",".join([
            q(v["youtube_video_id"]), q(v.get("title") or "(sans titre)"), q((v.get("description") or "")[:5000]), arr(v.get("tags")),
            q(v.get("channel_youtube_id")), q(v.get("channel_title")), q(v.get("published_at")),
            str(v["duration_sec"]) if v.get("duration_sec") is not None else "NULL", q(v.get("live_broadcast")), q(v.get("default_audio_language")),
            q(v.get("category_id")), str(v.get("view_count") or "NULL"), str(v.get("like_count") or "NULL"),
            "NULL" if v.get("has_captions") is None else str(v["has_captions"]).lower(), q(v.get("thumbnail_url")),
            arr(v.get("matched_person_ids"), "integer"), arr(v.get("matched_names")), arr(v.get("match_sources")),
            str(v.get("relevance_score")) if v.get("relevance_score") is not None else "NULL", q(v.get("relevance_reason")), q(v.get("scored_by")),
            q(v.get("status") or "candidate"), q(json.dumps(v.get("raw"), ensure_ascii=False)) + "::jsonb" if v.get("raw") else "NULL",
        ]) + ")")
    if not rows:
        print("-- aucune ligne"); return
    print("""insert into discovery.channels (youtube_channel_id, title, kind, priority) select distinct x.cid, x.ctitle, 'media', 3
from (values """ + ",".join(f"({q(json.loads(l)['channel_youtube_id'])},{q(json.loads(l).get('channel_title'))})" for l in open(a.inp, encoding='utf-8') if json.loads(l).get('channel_youtube_id')) + """) as x(cid, ctitle)
on conflict (youtube_channel_id) do nothing;""")
    print("""insert into discovery.videos (youtube_video_id, title, description, tags, channel_youtube_id, channel_title, published_at,
  duration_sec, live_broadcast, default_audio_language, category_id, view_count, like_count, has_captions, thumbnail_url,
  matched_person_ids, matched_names, match_sources, relevance_score, relevance_reason, scored_by, status, raw) values
""" + ",\n".join(rows) + """
on conflict (youtube_video_id) do update set
  last_seen_at = now(),
  title = excluded.title, description = coalesce(excluded.description, discovery.videos.description),
  tags = coalesce(excluded.tags, discovery.videos.tags), duration_sec = coalesce(excluded.duration_sec, discovery.videos.duration_sec),
  view_count = coalesce(excluded.view_count, discovery.videos.view_count), raw = coalesce(excluded.raw, discovery.videos.raw),
  matched_person_ids = (select array_agg(distinct x) from unnest(discovery.videos.matched_person_ids || excluded.matched_person_ids) x),
  matched_names = (select array_agg(distinct x) from unnest(discovery.videos.matched_names || excluded.matched_names) x),
  match_sources = (select array_agg(distinct x) from unnest(discovery.videos.match_sources || excluded.match_sources) x),
  relevance_score = case when discovery.videos.scored_by like 'llm%' or discovery.videos.scored_by = 'human' then discovery.videos.relevance_score else greatest(discovery.videos.relevance_score, excluded.relevance_score) end,
  status = case when discovery.videos.status in ('ingested','exported','relevant','rejected') then discovery.videos.status else excluded.status end;""")


# ----------------------------------------------------------------------------- push (relais n8n -> Supabase)
def cmd_push(a):
    """Envoie les vidéos (JSONL enrichi par `match`) par lots au relais n8n, qui appelle
    public.discovery_upsert_videos. Jeton : env DISCOVERY_RELAY_TOKEN (ou --token). Journalise
    la passe (p_run) avec le premier lot si --run est fourni (JSON)."""
    token = a.token or os.environ.get("DISCOVERY_RELAY_TOKEN")
    if not token:
        sys.exit("DISCOVERY_RELAY_TOKEN manquant")
    url = a.url or os.environ.get("DISCOVERY_RELAY_URL", "https://n8n.srv1810171.hstgr.cloud/webhook/discovery-ingest")
    items = [json.loads(l) for l in open(a.inp, encoding="utf-8") if l.strip()]
    keep = ["youtube_video_id","title","description","tags","channel_youtube_id","channel_title","published_at","duration_sec",
            "live_broadcast","default_audio_language","category_id","view_count","like_count","has_captions","thumbnail_url",
            "matched_person_ids","matched_names","match_sources","relevance_score","relevance_reason","scored_by","status","raw"]
    items = [{k: v.get(k) for k in keep if k in v} for v in items]
    if a.no_raw:
        for v in items: v.pop("raw", None)
    run = json.loads(a.run) if a.run else None
    tot_ins = tot_upd = 0
    for i in range(0, max(len(items), 1), a.batch):
        chunk = items[i:i + a.batch]
        if not chunk and not run:
            break
        payload = {"p_token": token, "p_items": chunk, "p_run": run if i == 0 else None}
        req = urllib.request.Request(url, data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                                     headers={"Content-Type": "application/json", "X-Harvest-Token": token}, method="POST")
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=180) as r:
                    res = json.load(r)
                break
            except urllib.error.HTTPError as e:
                body = e.read().decode("utf-8", "replace")
                if attempt == 3 or e.code < 500:
                    sys.exit(f"push HTTP {e.code}: {body[:300]}")
            except (urllib.error.URLError, TimeoutError):
                if attempt == 3:
                    raise
            time.sleep(2 ** attempt)
        if isinstance(res, dict) and "inserted" in res:
            tot_ins += res.get("inserted", 0); tot_upd += res.get("updated", 0)
            print(f"lot {i // a.batch + 1}: +{res.get('inserted', 0)} insérées, {res.get('updated', 0)} mises à jour, run_id={res.get('run_id')}", file=sys.stderr)
        else:
            sys.exit(f"push: réponse inattendue {str(res)[:300]}")
        if not chunk:
            break
    print(json.dumps({"pushed": len(items), "inserted": tot_ins, "updated": tot_upd}), file=sys.stderr)


def cmd_score(a):
    """Déclenche le scoring LLM côté n8n (workflow « Discovery — scoring LLM ») par lots de --limit candidates."""
    token = a.token or os.environ.get("DISCOVERY_RELAY_TOKEN")
    if not token:
        sys.exit("DISCOVERY_RELAY_TOKEN manquant")
    url = os.environ.get("DISCOVERY_SCORE_URL", "https://n8n.srv1810171.hstgr.cloud/webhook/discovery-score")
    tot = {"scored": 0, "relevant": 0, "rejected": 0, "grey": 0}
    for i in range(a.rounds):
        req = urllib.request.Request(url, data=json.dumps({"p_token": token, "limit": a.limit}).encode(),
                                     headers={"Content-Type": "application/json", "X-Harvest-Token": token}, method="POST")
        res = None
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=900) as r:
                    res = json.load(r)
                break
            except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
                print(f"lot {i + 1}: tentative {attempt + 1} échouée ({type(e).__name__}) — attente {15 * (attempt + 1)} s", file=sys.stderr)
                time.sleep(15 * (attempt + 1))
        if res is None:
            print(f"lot {i + 1}: abandon après 4 tentatives", file=sys.stderr)
            break
        for k in tot:
            tot[k] += int(res.get(k, 0) or 0)
        print(f"lot {i + 1}: {res}", file=sys.stderr)
        if not res.get("scored"):
            break
    print(json.dumps(tot), file=sys.stderr)


def _relay_token(a):
    token = getattr(a, "token", None) or os.environ.get("DISCOVERY_RELAY_TOKEN")
    if not token:
        sys.exit("DISCOVERY_RELAY_TOKEN manquant")
    return token


def ops(action, args=None, token=None):
    """Appelle public.discovery_ops via le relais n8n (status, coverage, registry, sync_ingested, set_channel_active, add_channel, add_person, report, sql_read)."""
    token = token or os.environ.get("DISCOVERY_RELAY_TOKEN")
    url = os.environ.get("DISCOVERY_OPS_URL", "https://n8n.srv1810171.hstgr.cloud/webhook/discovery-ops")
    req = urllib.request.Request(url, data=json.dumps({"p_token": token, "p_action": action, "p_args": args or {}}, ensure_ascii=False).encode("utf-8"),
                                 headers={"Content-Type": "application/json", "X-Harvest-Token": token}, method="POST")
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                out = json.load(r)
            # le relais renvoie {"error": {...}} (HTTP 200) quand Supabase répond en erreur ; on ne rejoue
            # que les 5xx (504 Gateway Timeout fréquent sous charge) et seulement pour les actions idempotentes
            err = out.get("error") if isinstance(out, dict) else None
            if err and attempt < 3 and action in ("status", "coverage", "registry", "sql_read", "sync_ingested") \
               and str(err.get("status") or err.get("message", "")).lstrip().startswith("5"):
                time.sleep(5 * (attempt + 1)); continue
            return out
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            if isinstance(e, urllib.error.HTTPError) and e.code < 500:
                sys.exit(f"ops {action}: HTTP {e.code} {e.read().decode('utf-8', 'replace')[:300]}")
            if attempt == 3:
                raise
            time.sleep(5 * (attempt + 1))


def cmd_ops(a):
    args = json.loads(a.args) if a.args else {}
    if a.sql:
        a.action, args = "sql_read", {"query": a.sql}
    print(json.dumps(ops(a.action, args, _relay_token(a)), ensure_ascii=False, indent=1))


def cmd_registry(a):
    """Régénère registry_persons.* et registry_channels.* depuis la base (via ops registry)."""
    reg = ops("registry", {}, _relay_token(a))
    here = os.path.dirname(os.path.abspath(__file__))
    P, C = reg.get("persons", []), reg.get("channels", [])
    json.dump(P, open(os.path.join(here, "registry_persons.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    json.dump(C, open(os.path.join(here, "registry_channels.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    with open(os.path.join(here, "registry_persons.txt"), "w", encoding="utf-8") as f:
        for p in P:
            f.write(f"{p['id']}|{p['display_name']}|{';'.join(p.get('aliases') or [])}|{p.get('youtube_channel_id') or ''}\n")
    with open(os.path.join(here, "registry_channels.txt"), "w", encoding="utf-8") as f:
        for c in C:
            f.write(f"{c['youtube_channel_id']}|{c['kind']}|{c.get('person_id') or ''}|{c.get('priority', 2)}|{(c.get('title') or '').replace('|', '/')}\n")
    print(json.dumps({"persons": len(P), "channels": len(C)}), file=sys.stderr)


def parse_duration(iso_d):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso_d or "")
    if not m:
        return None
    d, h, mi, s = (int(x or 0) for x in m.groups())
    return d * 86400 + h * 3600 + mi * 60 + s


def report(a, **kw):
    rep = {"units": QUOTA["units"], "calls": QUOTA["calls"], "window_from": getattr(a, "frm", None), "window_to": getattr(a, "to", None), **kw}
    print(json.dumps(rep, ensure_ascii=False), file=sys.stderr)
    if getattr(a, "report", None):
        with open(a.report, "a", encoding="utf-8") as f:
            f.write(json.dumps({"at": datetime.now(timezone.utc).isoformat(), **rep}, ensure_ascii=False) + "\n")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    u = sp.add_parser("uploads"); u.add_argument("--channel", required=True); u.add_argument("--from", dest="frm", required=True); u.add_argument("--to", required=True)
    u.add_argument("--max-pages", type=int, default=400); u.add_argument("--out", required=True); u.add_argument("--report")
    d = sp.add_parser("details"); d.add_argument("--ids-file", required=True); d.add_argument("--out", required=True); d.add_argument("--report")
    s = sp.add_parser("search"); s.add_argument("--q", required=True); s.add_argument("--from", dest="frm", required=True); s.add_argument("--to", required=True)
    s.add_argument("--max-pages", type=int, default=1); s.add_argument("--out", required=True); s.add_argument("--report")
    c = sp.add_parser("channel"); c.add_argument("--handle", required=True); c.add_argument("--report")
    m = sp.add_parser("match"); m.add_argument("--persons", required=True); m.add_argument("--channels", required=True); m.add_argument("--in", dest="inp", required=True); m.add_argument("--out", required=True)
    t = sp.add_parser("to-sql"); t.add_argument("--in", dest="inp", required=True)
    ps = sp.add_parser("push"); ps.add_argument("--in", dest="inp", required=True); ps.add_argument("--batch", type=int, default=150)
    ps.add_argument("--run"); ps.add_argument("--token"); ps.add_argument("--url"); ps.add_argument("--no-raw", action="store_true")
    sc = sp.add_parser("score"); sc.add_argument("--limit", type=int, default=50); sc.add_argument("--rounds", type=int, default=1); sc.add_argument("--token")
    op = sp.add_parser("ops"); op.add_argument("--action", default="status"); op.add_argument("--args"); op.add_argument("--sql"); op.add_argument("--token")
    rg = sp.add_parser("registry"); rg.add_argument("--token")
    a = p.parse_args()
    {"uploads": cmd_uploads, "details": cmd_details, "search": cmd_search, "channel": cmd_channel, "match": cmd_match, "to-sql": cmd_to_sql, "push": cmd_push, "score": cmd_score, "ops": cmd_ops, "registry": cmd_registry}[a.cmd](a)


if __name__ == "__main__":
    main()
