# Local continuation checkpoint — 22/11/2026

## Objective and current instruction
Continue the actual GitHub graduation project locally; user will deploy to VPS later. Do not deploy, push or merge. Current GitHub source supersedes the older bootstrap documents. Preserve unrelated portfolio and preliminary local files.

## Exact source
- Repo: https://github.com/nvu-1801/phan-nguyen-vu-graduation-2026 (private)
- Active path: D:\backup\Portfolio 3D\graduation-2026
- Branch: main, base HEAD c8bfb7fedbdaa0e46c2808fffdeba7307a16a6c8
- Cloned successfully; changes below are uncommitted, not pushed.
- An initial incomplete scaffold remains separately at D:\backup\Portfolio 3D\phan-nguyen-vu-graduation-2026. It is NOT the active project. Original portfolio and handoff remain intact.

## Completed
Installed locked dependencies, processed verified original images. Fixed Windows image output paths with fileURLToPath, limited Next tracing/Turbopack root to repo. Added SITE_ORIGIN for HTTPS proxy origin validation and opt-in TRUST_PROXY X-Real-IP rate limiting. Added Dockerfile, compose persistent SQLite volume, dockerignore, VPS setup/backup documentation and proxy regression test. Kept latest upstream interface and existing transparent portraits. No need to reconstruct from obsolete bootstrap.

Modified files: .env.example, README.md, next.config.ts, playwright.config.ts, scripts/process-images.mjs, scripts/serve-test.mjs, src/lib/api.ts, tests/e2e/graduation.spec.ts, CONTINUE.md.
New files: .dockerignore, Dockerfile, compose.yaml, docs/VPS.md, docs/local-mobile.png, scripts/preview-check.cjs.

## Actual verification
- npm ci: 387 packages installed, audit reported 0 vulnerabilities. System Node 22 produced expected engine warning; later checks use npm exec --yes --package=node@24 -- node (v24.22.3).
- npm run images: passed; hashes/budgets enforced by existing image script.
- npm run lint: passed (including final scripts).
- npm run build: passed outside Windows sandbox. Initial sandbox attempt failed junction permission; no app failure.
- Node 24 next build: passed with TypeScript and all routes.
- Node 24 tsc --noEmit: passed.
- Node 24 --test tests/db/*.test.mjs: 1 passed, persistence/migration/constraints.
- Node 24 Playwright full existing suite: 12 passed, 36.9s. Includes 360/390/768/1440, axe serious/critical, JS off, QR dialog, photos/calendar, RSVP/concurrent retry/privacy, wishes moderation/plain text, abuse validation, no-DB contact, Three scene.
- Added VPS test run separately: 1 passed, 6.1s. HTTPS configured origin accepted, 6th write from same IP throttled, separate proxy IP accepted, foreign origin rejected.
- docker compose config --no-env-resolution --quiet: passed. Docker image build/runtime and Nginx not tested on VPS.
- git diff --check: passed.
- npm exec Node 24 scripts/migrate.mjs: passed on separate local data/graduation.db (not test DB).
- Production server running http://127.0.0.1:3010, exec session 70053. No monitoring after turn ends.
- Mobile production screenshot inspected: docs/local-mobile.png. Map iframe external content not verified by static screenshot.
- Latest quota check: 90% primary, 21% weekly remaining, above stop threshold.

## Next concrete steps
User can review http://localhost:3010. Deploy manually per docs/VPS.md when ready: configure real SITE_ORIGIN/secret, docker compose --env-file .env.production up -d --build, Nginx + TLS, verify health, consent/RSVP/wishes and persistence across restart, backup volume. Actual QR scan, VPS image/runtime and real device checks remain unverified. No production credentials required or configured here. Do not claim VPS deployed.

## Next UI/content objective (22/11/2026)
User requested audit and continuation plan, and explicitly selected cream + wine red, elegant. Read docs/UI_CONTENT_IMPROVEMENT_PLAN.md before implementing. Audit completed against current source/mobile screenshot and fresh 1440px desktop capture (docs/audit-desktop.png). Plan covers section consolidation, copy, forms/privacy semantics, map fallback and responsive QA. Redesign has NOT been implemented yet. Next: phase A static content/layout/tokens, preserving all current VPS/local fixes. No push/deploy authorization added.
## Implemented: fresh blue UI and scroll choreography — 22/11/2026

Latest user instruction supersedes cream/wine plan: use brighter, lighter blue, obtain background imagery from the reference website, improve image sections and add stronger scroll motion. Implemented locally; no push/merge/deploy.

Added three reference backgrounds (FPT campus, venue, coffee), original files in assets/backgrounds; responsive metadata-stripped WebP derivatives in public/images/backgrounds. scripts/process-backgrounds.mjs runs from prebuild. Provenance, hashes and sizes: docs/reference/background-manifest.json + README.md. Reference venue photo has the old Bình Định sign, explicitly noted in UI. No other person's portraits/payment QR/guest data reused.

Rebuilt page sections and CSS tokens: sky blue hero with cutout/photo label, campus photo, 3D-perspective event ticket, animated postcard section, concise letter, separate RSVP/wishes, venue image + optional map, coffee image footer. Removed oversized date calendar/countdown and repeated RSVP portrait. Forms are full-width in their own grid; attendance=no label now correctly says unable to attend. Private wishes receipt no longer promises publication.

New ScrollEffects.tsx: staggered intro, scroll-progress bar, portrait/orbit parallax, photo background parallax, campus clip-path opening, ticket perspective, letter reveal and decorative rings. GSAP media/context teardown respects reduced motion. Existing Three.js postcard camera orbit and card separation increased. Native scroll preserved.

Changed this phase: src/app/page.tsx, globals.css, components/ScrollEffects.tsx (new), EventActions.tsx, GraduationPhotoScene.tsx, Guestbook.tsx, PhotoStory.tsx, scripts/process-images.mjs; tests/e2e/graduation.spec.ts; docs/UI_CONTENT_IMPROVEMENT_PLAN.md updated to record superseded color choice. New background assets/process script/reference docs and preview captures. Renamed prior preview-check.cjs to preview-check.mjs, added capture-hero.mjs. Prior VPS/local fixes remain uncommitted and preserved. Base main HEAD remains c8bfb7fedbdaa0e46c2808fffdeba7307a16a6c8.

Actual checks:
- npm exec --yes --package=node@24 -c "npm run build": pass, prebuild processes portraits/backgrounds/OG, TypeScript and route generation pass.
- npm run lint: pass before final capture helper; final lint recheck recorded by session 62547.
- Full Playwright suite: 15 passed (20.7s), including UI 360/390/768/1440 + axe, no-JS, QR, photos, SQLite API/consent/moderation/retries, proxy, scroll forward/reverse/resize/reduced-motion, local backgrounds and opt-in map.
- A decorative low-contrast text issue was found and fixed without changing axe checks. Final image-section polish replaces decorative background lettering with concentric rings. After final polish, 6 relevant responsive/accessibility/motion/Three tests passed (12.5s).
- Screenshots inspected at desktop/mobile. Latest preview captures: docs/blue-preview-1440.png, blue-preview-390.png, blue-hero.png. Static screenshots use reduced motion; live scroll behavior checked via browser tests.
- Source background public URLs were fetched via PowerShell after web open was unavailable. No claim of asset ownership/license was inferred.
- Live final production preview: http://127.0.0.1:3011, exec session 74242. Previous own 3011 process was verified and restarted after final build. Port 3010 had an existing listener and was left intact. No background monitoring promised after turn ends.
- Latest quota: 38% primary, 13% weekly remaining, not below threshold.

Remaining limits: Vercel URL still serves its previous deployment. No VPS/Docker runtime/real phone GPU/QR banking scan verification performed. No Lighthouse/FPS claimed. User can review local preview and deploy later via docs/VPS.md. Keep current branch/local changes; do not reset or replace with preliminary scaffold. Next only if requested: further visual refinement or deployment within user's authorized scope.
## Latest authorization: content improvement and push main — 22/11/2026

User now explicitly authorizes applying richer, sincere invitation/greeting/wishes copy and pushing completed code to main. This supersedes earlier no-push notes. Includes the prior requested blue UI/background/scroll work; do not deploy manually to VPS. Main was fetched before work and had no new commits beyond local base.

New src/content/copy.ts centralizes rewritten greeting, hero, campus/event copy, 5-paragraph letter, RSVP/wishes/photo/coffee/closing and 3 wishes from Vũ to visitors. Added clearly labeled 6 editable wish ideas in WishIdeas.tsx: selection fills/appends draft, never submits or enables consent. No-DB visitors can send ideas via SMS. No fake guest wishes seeded. Full reference letter was read, then independently rewritten; no unverified four-year claim imported. docs/CONTENT_NOTES.md records editorial source/behavior.

Local screenshots and downloaded reference HTML/CSS are preserved but excluded from Git, as are regenerable public background derivatives. Original background JPEGs and processing script/provenance are included for reproducible builds. No secrets/real DB/build output staged.

Current verification: Node24 production build (including prebuild and TypeScript) passed; npm run lint passed; SQLite migration/persistence test passed. Full browser suite expanded to 17 including editable suggestions/no automatic writes and no-DB SMS suggestions; exact final result recorded in completion message and Git commit verification. Push expected to trigger configured Git CI/deployment integration; do not call this a verified new deployment until service reports it.

Final pre-push verification: full 17 Playwright tests passed (31.5s); production build + TypeScript, lint, 1 SQLite test and staged diff whitespace check all passed. Changes prepared for main per explicit user request. Actual push outcome is verified against origin/main after commit; no manual VPS deployment performed.
## Production container and VPS readiness — 22/11/2026

Current objective: run BE and FE and keep building/fixing until the project can start on a VPS. User has Docker Desktop open; prior request authorizes pushing completed code to main. No actual VPS/domain/SSH configuration supplied, so do not claim remote deployment.

Source base main f9004309fbc456883ac872218270919e4a1fa2d2. Active workspace remains D:\backup\Portfolio 3D\graduation-2026. Unrelated portfolio/scaffold preserved.

Changed production delivery: multi-stage Node24 Linux Dockerfile, Next standalone output, copy public/static/migrations/moderation only, UID1000, init/graceful shutdown and migration-aware healthcheck. Compose requires origin/secret, loopback-port and trust-proxy are configurable, SQLite uses persistent volume. Added npm docker:local/smoke/stop/logs and scripts/setup-docker-local.mjs + docker-smoke.mjs. Local setup generates ignored random-secret .env.docker.local without overwrite. Added VPS env/Nginx templates, expanded docs/VPS.md, docs/PRODUCTION_VERIFICATION.md, README and Git/Docker ignore rules. CI retains existing checks and adds local Docker build/smoke; actions pinned to upstream tag SHAs and checkout credential persistence disabled.

Actual verification: Linux Docker build passed npm ci, photos/background/OG prebuild, production Next/TypeScript and standalone tracing. Initial fontconfig warning fixed by installing build-only fontconfig/DejaVu. Runtime image approx 105 MB. Host lint, type generation/TypeScript and SQLite migration/reopen test passed. Six Docker smoke checks passed (twice after transient GET connection retry fix): real HTTP writes/retry/conflict/origin, frontend form submissions, consent/pending, moderation, container recreate persistence, mobile/assets/calendar/console. Fixtures cleaned by exact IDs. Backup app-stop/copy/start tested; separate read-only container returned SQLite integrity_check=ok and schema version2. Nginx container nginx -t passed. actionlint/zizmor not installed; matching GitHub Actions result must be checked after push.

Running app: http://localhost:3020, /api/health returns status=ok, Docker project graduation-local, service invitation, container graduation-local-invitation-1, volume graduation-local_graduation-data. Managed by Docker restart policy, not a foreground exec session. Local .env.docker.local contains secret and is ignored; never include it in Git or outputs. Backups in backups/docker-verified are ignored and untouched after validation. Other local Node preview ports are unrelated to this production validation.

Proof artifacts (ignored): test-results/docker/report.json and mobile.png. Latest built image before docs/CI-only edits has ID sha256:9ded1537ee6ef3592273394b304aa32e8e9a4dae19b07f97df2ac0b0567a5b56. Exact current artifact identity readable via docker image inspect. Quota latest: 76% primary, 96% weekly remaining.

Next: push reviewed production changes to main, follow matching CI through result, fix actual CI failures if any. User can start on VPS per docs/VPS.md with actual domain and generated secret. Real VPS DNS/TLS/firewall, phone GPU, QR banking scan remain unverified. No claim of background monitoring after turn ends.
## CI follow-up: fully consume smoke HTTP bodies

The initial production CI run 45018266896 for bb118df passed lint/typecheck/SQLite/build, all 17 browser tests, Docker build/start, and the first 5 Docker smoke checks including durable SQLite after recreate. It failed in Node24 Undici Parser.finish while testing assets because response bodies were left unread. The smoke HTTP helper now fully drains both success/error/image responses before returning status/JSON. Mutations are still not blindly retried, and all existing assertions remain. Local lint and all 6 Docker smoke checks passed after the fix. Next commit/run must be verified; initial failed CI must not be reported green.
## Map, photo startup, floating contact dock and CI update

Latest user request: direct map matching reference, smoother section 03 first entry, bottom-right back-to-top/phone/Zalo/coffee buttons, fuller GitHub Actions, then push main. Base main 2d99b13b6bc104ab4b290db7d3521196e6bbc608; workspace unchanged D:\backup\Portfolio 3D\graduation-2026.

Applied direct lazy Google Maps iframe (Vietnamese) with external fallback link, removed artificial preview gate. New FloatingActions dock outside all transformed sections: desktop vertical, mobile horizontal >=44px controls/safe area, tel:+84343628267, Zalo https://zalo.me/0343628267, back-to-top anchor and existing native QR dialog. Removed footer duplicate phone/top/coffee triggers. Native Escape/focus return preserved; QR fallback works without JavaScript.

Section03 warms scene 1200px before viewport, initializes progress from actual scroll position (including refresh), keeps HTML poster until first positioned frame and crossfades, starts motion at viewport entry, avoids global refresh on ready, separates initial cards. Reduced motion, DPR caps and context-loss fallback retained. No real-device FPS claim.

CI existing lint/typecheck/SQLite/build/browser/Docker steps retained; added manual workflow_dispatch, per-ref concurrency/cancel, forbidOnly under CI, failure diagnostics before cleanup, trace/log artifacts with 7-day retention. No fake deploy action or VPS secret added. actionlint/zizmor unavailable locally; validate matching workflow after push.

Actual verification so far: lint and production build/TypeScript passed; 20 Playwright tests passed (1.1m), including four viewport widths + axe, no JS QR, native dialog, draft wishes/consent/moderation/retries, proxy origin/IP, direct map contract, fixed dock phone/Zalo/viewport/top on 390/1440, delayed scene textures and WebGL context loss. Automated Google iframe content stubbed to isolate external service UI; real embed attributes checked. Actual Zalo account not independently verified.

Changed: .github/workflows/ci.yml, playwright.config.ts, src/app/globals.css, page.tsx, components/EventActions.tsx, GraduationPhotoScene.tsx, PhotoStage.tsx, FloatingActions.tsx(new), content/event.ts, tests/e2e/graduation.spec.ts, docs/UI_FIXES.md(new), this checkpoint. Docs/UI_FIXES.md describes design/testing. Preview screenshots under ignored test-results/ui-fixes. Docker rebuild/smoke and exact matching remote CI are verified before completion report. Preserve local .env files/volumes and unrelated portfolio work. Existing live VPS requires git pull + compose rebuild to get new UI; do not claim this session changed the remote VPS automatically.

Final local evidence before push: Docker image build and healthy startup passed; all 6 production smoke checks passed. Live Google Maps tiles, mobile QR dialog and initial postcard separation inspected in screenshots. scripts/docker-smoke.mjs now prefers IPv4 and directs Chromium localhost to IPv4 so an unrelated IPv6 dev server at port3020 is not accidentally tested. No unrelated listener was stopped. Local actionlint/zizmor remain unavailable; matching remote CI will validate workflow.

## Handoff: user selected VPS activation

User chose existing VPS Docker + persistent SQLite volume; do not switch to Supabase/Postgres or request database secrets in chat. Read `docs/graduation/VPS_ACTIVATION_PLAN.md` for exact configuration, startup, acceptance checks and admin follow-up. Workspace at handoff: `D:\backup\Portfolio 3D\graduation-2026`; local HEAD remains `676ae03b8fb0030514687579475b071606732446`, staged wish/admin/UI files are present, GitHub main was verified at `6afbaa5614fec85bebf41f650e0a2d9b29a61141`. Do not reset staged work. No VPS credentials/SSH access were provided; no VPS changes were performed. Health 503 indicates DB connection/configuration/migration; missing admin secrets independently prevent admin sign-in.

## VPS activation Phase 1 executed — 24/11/2026

Ran the executable, non-VPS part of `docs/graduation/VPS_ACTIVATION_PLAN.md`.

- Synced local `main` from `676ae03` to `origin/main` `6afbaa5` (7 new commits). Index was byte-identical to `origin/main`, so the previously staged wish/admin/UI work was already upstream; `git reset --soft origin/main` moved HEAD without touching index or worktree. Preserved modified `CONTINUE.md` and untracked plan file. No reset/checkout of user work.
- Added commented `ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET` placeholders with requirements to `deploy/production.env.example` (safer than active placeholders: admin stays disabled until real values are set). Added `/admin` configuration, secure cookie/rate-limit notes, verification steps and separate encrypted `.env.production` backup guidance to `docs/VPS.md`; README points at the template. No real secrets added.
- Verified with Node 24: `npm run lint` pass, `npm run typecheck` pass, `npm run build` pass (5 static pages, `/admin` and admin APIs dynamic); `docker compose --env-file deploy/production.env.example config --quiet` pass; with a temporary dummy env, both admin vars appear in the service `environment`; `git diff --check` pass. Full Playwright suite not rerun because changes are docs/env-template only. Docker image/VPS runtime not retested this phase.
- Quota: no `get_usage_limits` tool is available in this session, so Codex quota could not be read; work proceeded as authorized.
- Committed as `3e115d6` ("Document VPS activation and admin configuration") and pushed to `origin/main` after the user authorized push/deploy. GitHub Actions run 45403585110 passed lint, typecheck, SQLite test, build, full Playwright, Docker build/smoke. The push used the `nvu-1801` GitHub CLI account; `vupn-sdt-ai` was denied. No VPS/SSH access was used, so remote deployment is still pending user commands.
- Next: user runs Phase 2–3 on the VPS (commands and acceptance checks already in the plan). Remaining optional engineering work is admin approve/reject buttons, explicitly deferred until production is stable; it needs a session+Origin-protected mutation endpoint, audit columns, confirmation UI and privacy tests.
