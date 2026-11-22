# Production verification — 22/11/2026

## Target and artifact

Local Docker Desktop Linux Engine 29.1.3, Compose v5.0.0. Source base `f9004309fbc456883ac872218270919e4a1fa2d2` plus production changes in this release. Image `graduation-2026:local`, runtime Linux Node 24, Next.js 16.4.6 standalone. Initial final multi-stage image ID `sha256:9ded1537ee6ef3592273394b304aa32e8e9a4dae19b07f97df2ac0b0567a5b56`; exact current image/container identity can be read with docker inspect. Changes to docs/CI do not change application source.

Runtime checked as UID 1000. Only public/static bundle, traced modules, migrations and moderation scripts copied to runtime, not original photographs or TypeScript app source. Built-in Docker healthcheck queries migration-aware /api/health. Compose binds loopback and persists /app/data. Empty required origin/secret prevent Compose startup.

## Actual checks

- Linux Docker build: passed `npm ci`, prebuild photos/backgrounds/OG, Next production build/TypeScript and standalone tracing.
- `npm run docker:local` via Node 24: passed; preserves existing local env, builds and waits healthy at http://localhost:3020.
- `npm run lint`: passed.
- `npm run typecheck` + `npm test`: passed type generation/TS and one SQLite migration/reopen/constraints test.
- `scripts/docker-smoke.mjs`: 6 checks passed against actual running production container. Real HTTP retry/conflict/origin, FE RSVP/wish form submission, consent/pending visibility, moderation, recreation with new container ID and durable SQLite, assets/calendar/mobile/console checks. Fixture records removed by exact IDs. First attempt exposed an HTTP keep-alive reset after recreation; only transient read requests now retry, mutation requests do not retry blindly.
- Stop application → copy volume data → start healthy: passed. A separate read-only container opened the backup; `PRAGMA integrity_check=ok`, migration version=2.
- Nginx template checked using `nginx:stable-alpine nginx -t`: syntax passed. No host port published by this validation.
- Local screenshot: test-results/docker/mobile.png. Report: test-results/docker/report.json. Both ignored by Git; CI uploads these artifacts.

## CI and provenance

Existing lint/typecheck/SQLite/build/browser checks retained. Added production Docker build and same smoke check, with separate local env/project and cleanup without removing volumes. Token permissions remain contents:read; checkout credential persistence disabled.

Action refs verified from upstream tags with git ls-remote on 22/11/2026:
- actions/checkout v5: fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09
- actions/setup-node v5: a0853c24544627f65ddf259abe73b1d18a591444
- actions/upload-artifact v4: ea165f8d65b6e75b540449e92b4886f43607fa02

Local actionlint and zizmor are not installed. Remote workflow result must be observed for the new commit, not inferred from push. No workflow permission elevation, force push or production secrets are used for tests.

## Boundaries and rollback

This verifies a Linux production container on the user's computer. Real VPS SSH/domain/DNS/TLS/firewall and QR phone scan remain unverified. No VPS deployment has been made. All smoke data stays in the isolated local Docker project and is cleaned; no production seeding.

Use docs/VPS.md for configuration and startup, deploy/production.env.example and deploy/nginx.conf.example for templates. Preserve Compose project identity and its volume. Before changing releases, backup stopped DB and record image/SHA. Rebuild/start a previous app revision only with a schema-compatible DB; rollback code does not undo data migrations. Never use down -v for routine updates.

## Primary references

- [Next.js output/standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output): traced output and explicit copying of public/static assets.
- [Docker volume lifecycle](https://docs.docker.com/engine/storage/volumes/): data persists independently of container recreation.
- Upstream skill snapshots read at ui-motion-skills commit 48377973bd111a14f1fd5542bfecea1cf48ba5d1: release-deploy (+ deployment handoff), backend-nextjs, backend-api-contracts and github-actions. No unrelated services installed.
