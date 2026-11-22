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
