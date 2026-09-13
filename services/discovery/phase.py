#!/usr/bin/env python3
"""
Orchestration d'une passe de collecte (reprise historique) — pilote harvest.py canal par canal,
pousse chaque canal au relais dès qu'il est terminé (résultat persistant, reprise possible).

  python3 phase.py own-channels --from 2025-01-01 [--to 2026-09-14] [--only UC...,UC...] [--tier 1]
  python3 phase.py channels --kind party,institution --from ...          (chaînes de partis / institutions)
  python3 phase.py channels --kind media --priority 1 --from ...         (médias prioritaires)

Registre lu depuis registry_persons.json / registry_channels.json (export du schéma discovery).
Sortie : work/<phase>/<channel>.{uploads,details,matched}.jsonl + journal work/<phase>/log.jsonl
"""
import argparse, json, os, subprocess, sys, time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
H = [sys.executable, os.path.join(HERE, "harvest.py")]


def sh(args, capture=True):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{' '.join(args[-6:])}\n{r.stderr[-800:]}")
    return r


def last_report(stderr):
    for line in reversed(stderr.strip().splitlines()):
        if line.startswith("{"):
            try:
                return json.loads(line)
            except Exception:
                pass
    return {}


def run_channel(cid, title, frm, to, work, persons, channels, max_pages, no_raw, prefilter=False):
    base = os.path.join(work, cid)
    up, det, mat = base + ".uploads.jsonl", base + ".details.jsonl", base + ".matched.jsonl"
    for f in (up, det, mat):
        if os.path.exists(f):
            os.remove(f)
    t0 = time.time()
    r = sh(H + ["uploads", "--channel", cid, "--from", frm, "--to", to, "--max-pages", str(max_pages), "--out", up])
    rep_up = last_report(r.stderr)
    n_up = sum(1 for _ in open(up, encoding="utf-8")) if os.path.exists(up) else 0
    units = rep_up.get("units", 0)
    n_det = n_match = 0
    if n_up and prefilter:
        # chaînes tierces : filtre de noms sur titre+description de la playlist AVANT d'acheter les détails
        pre = base + ".prefilter.jsonl"
        sh(H + ["match", "--persons", persons, "--channels", channels, "--in", up, "--out", pre])
        n_pre = sum(1 for _ in open(pre, encoding="utf-8")) if os.path.exists(pre) else 0
        os.replace(pre, up) if n_pre else open(up, "w").close()
        n_up = n_pre
    if n_up:
        ids = [json.loads(l)["youtube_video_id"] for l in open(up, encoding="utf-8")]
        with open(base + ".ids.txt", "w") as f:
            f.write("\n".join(ids))
        r = sh(H + ["details", "--ids-file", base + ".ids.txt", "--out", det])
        units += last_report(r.stderr).get("units", 0)
        n_det = sum(1 for _ in open(det, encoding="utf-8"))
        r = sh(H + ["match", "--persons", persons, "--channels", channels, "--in", det, "--out", mat])
        n_match = sum(1 for _ in open(mat, encoding="utf-8")) if os.path.exists(mat) else 0
    run = {"source": "playlist", "channel_youtube_id": cid, "window_from": frm, "window_to": to, "api_units": units,
           "pages": rep_up.get("pages", 0), "videos_seen": rep_up.get("seen", 0), "videos_matched": n_match,
           "started_at": datetime.fromtimestamp(t0, timezone.utc).isoformat(), "notes": f"phase own/channels — {title}"}
    if n_match:
        r = sh(H + ["push", "--in", mat, "--run", json.dumps(run, ensure_ascii=False)] + (["--no-raw"] if no_raw else []))
        pushed = last_report(r.stderr)
    else:
        # journalise quand même la passe (0 vidéo) pour la couverture scanned_from/to
        empty = base + ".empty.jsonl"; open(empty, "w").close()
        r = sh(H + ["push", "--in", empty, "--run", json.dumps(run, ensure_ascii=False)])
        pushed = {"inserted": 0, "updated": 0}
    return {"channel": cid, "title": title, "units": units, "uploads_in_window": rep_up.get("kept", n_up), "prefiltered": n_up if prefilter else None, "details": n_det, "matched": n_match,
            "inserted": pushed.get("inserted"), "updated": pushed.get("updated"), "seconds": round(time.time() - t0, 1)}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("phase", choices=["own-channels", "channels"])
    p.add_argument("--from", dest="frm", required=True); p.add_argument("--to", default=datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    p.add_argument("--only"); p.add_argument("--kind", default="party,institution"); p.add_argument("--priority", type=int)
    p.add_argument("--max-pages", type=int, default=400); p.add_argument("--budget", type=int, default=6000, help="unités max pour cette passe")
    p.add_argument("--no-raw", action="store_true"); p.add_argument("--work", default=os.path.join(HERE, "work"))
    a = p.parse_args()
    persons_f, channels_f = os.path.join(HERE, "registry_persons.json"), os.path.join(HERE, "registry_channels.json")
    persons = json.load(open(persons_f, encoding="utf-8")); channels = json.load(open(channels_f, encoding="utf-8"))
    if a.phase == "own-channels":
        targets = [(x["youtube_channel_id"], x["display_name"]) for x in persons if x.get("youtube_channel_id")]
    else:
        kinds = set(a.kind.split(","))
        targets = [(c["youtube_channel_id"], c.get("title") or c["youtube_channel_id"]) for c in channels
                   if c["kind"] in kinds and (a.priority is None or c.get("priority") == a.priority)]
    if a.only:
        keep = set(a.only.split(",")); targets = [t for t in targets if t[0] in keep]
    work = os.path.join(a.work, a.phase); os.makedirs(work, exist_ok=True)
    log = open(os.path.join(work, "log.jsonl"), "a", encoding="utf-8")
    spent = 0
    print(f"{len(targets)} chaînes, fenêtre {a.frm} → {a.to}, budget {a.budget} u", file=sys.stderr)
    for i, (cid, title) in enumerate(targets, 1):
        if spent >= a.budget:
            print(f"budget atteint ({spent} u), arrêt avant {title}", file=sys.stderr); break
        try:
            res = run_channel(cid, title, a.frm, a.to, work, persons_f, channels_f, a.max_pages, a.no_raw, prefilter=(a.phase != 'own-channels'))
        except Exception as e:
            res = {"channel": cid, "title": title, "error": str(e)[-500:]}
            if "QUOTA" in str(e):
                log.write(json.dumps(res, ensure_ascii=False) + "\n"); print("QUOTA ÉPUISÉE — arrêt", file=sys.stderr); break
        spent += res.get("units", 0) or 0
        res["at"] = datetime.now(timezone.utc).isoformat(); log.write(json.dumps(res, ensure_ascii=False) + "\n"); log.flush()
        print(f"[{i}/{len(targets)}] {title}: {res.get('uploads_in_window', '?')} vidéos, {res.get('matched', '?')} retenues, "
              f"+{res.get('inserted', '?')} en base, {res.get('units', 0)} u (cumul {spent})" + (f" ERREUR {res['error'][:120]}" if 'error' in res else ""), file=sys.stderr)
    print(json.dumps({"channels": len(targets), "units": spent}), file=sys.stderr)


if __name__ == "__main__":
    main()
