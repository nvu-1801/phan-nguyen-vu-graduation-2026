# UI map, photo scene and floating actions

Scope requested: direct map like reference, fix section 03 startup hesitation, move back-to-top/telephone/Zalo/coffee to a bottom-right fixed group, complete GitHub Actions and push main.

- Map: real Google Maps iframe in server HTML, lazy-loaded directly, Vietnamese language, reference-style referrer policy, permanent external Maps link. Removed artificial map preview and click-to-load gate. Source checked: public iframe at https://heejoon-graduation-2026.vercel.app/.
- Dock: desktop vertical, compact mobile horizontal at bottom-right with safe-area spacing, >=44px targets, visible hover/focus labels. Telephone 0343 628 267 and Zalo link https://zalo.me/0343628267. Coffee opens the existing native QR dialog (Escape/focus return); no-JS fallback opens original QR. Removed duplicate footer contact/top/QR triggers. No claim that the Zalo account itself has been independently verified.
- Section 03: start warm-up 1200px before viewport, keep poster until first positioned WebGL draw, initialize and refresh progress at actual scroll offset, begin motion as stage enters viewport, avoid global trigger refresh on readiness, reduce initial postcard overlap. Native scroll, DPR caps, reduced motion and context-loss fallback retained. Real-device frame times/FPS not measured.
- CI: existing pinned Actions/readonly permissions, lint/typecheck/SQLite/production build/browser/Docker checks retained. Added manual dispatch, per-ref concurrency, forbidOnly in CI, failure-only container logs and trace archives with 7-day retention. No production deployment/SSH secrets added, no dummy deploy job.

Verification: lint and production build/TypeScript passed. Full Playwright suite: 20 passed (1.1m), including map embed contract, dock viewport anchoring/phone/Zalo/QR/back-to-top at 390/1440, no-JS QR fallback, delayed textures/poster, resize/forward/reverse and WebGL context loss. Existing privacy/moderation/idempotency/proxy tests stay green. External Google UI is stubbed in automated tests for reproducibility; iframe URL/title/loading and own external fallback link are checked. Runtime screenshots and Docker report are kept under ignored test-results.

Local actionlint/zizmor unavailable as previously recorded. Actual workflow syntax and runner behavior are validated by matching GitHub Actions run after push, not inferred from local test success.

Docker production build/start and all 6 BE/FE/persistence smoke checks passed. Live Google iframe rendered actual map tiles in the desktop screenshot; QR dialog and two separated postcards were visually inspected. Local Docker harness now forces IPv4 for localhost because an unrelated development app was listening on IPv6 at the same port; that unrelated app was left untouched.
