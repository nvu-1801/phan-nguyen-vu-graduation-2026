# UI map, photo scene and floating actions

Scope requested: direct map like reference, fix section 03 startup hesitation, move back-to-top/telephone/Zalo/coffee to a bottom-right fixed group, complete GitHub Actions and push main.

- Map: real Google Maps iframe in server HTML, lazy-loaded directly, Vietnamese language, reference-style referrer policy, permanent external Maps link. Removed artificial map preview and click-to-load gate. Source checked: public iframe at https://heejoon-graduation-2026.vercel.app/.
- Dock: desktop vertical, compact mobile horizontal at bottom-right with safe-area spacing, >=44px targets, visible hover/focus labels. Telephone 0343 628 267 and Zalo link https://zalo.me/0343628267. Coffee opens the existing native QR dialog (Escape/focus return); no-JS fallback opens original QR. Removed duplicate footer contact/top/QR triggers. No claim that the Zalo account itself has been independently verified.
- Section 03: start warm-up 1200px before viewport, keep poster until first positioned WebGL draw, initialize and refresh progress at actual scroll offset, begin motion as stage enters viewport, avoid global trigger refresh on readiness, reduce initial postcard overlap. Native scroll, DPR caps, reduced motion and context-loss fallback retained. Real-device frame times/FPS not measured.
- CI: existing pinned Actions/readonly permissions, lint/typecheck/SQLite/production build/browser/Docker checks retained. Added manual dispatch, per-ref concurrency, forbidOnly in CI, failure-only container logs and trace archives with 7-day retention. No production deployment/SSH secrets added, no dummy deploy job.

Verification: lint and production build/TypeScript passed. Full Playwright suite: 20 passed (1.1m), including map embed contract, dock viewport anchoring/phone/Zalo/QR/back-to-top at 390/1440, no-JS QR fallback, delayed textures/poster, resize/forward/reverse and WebGL context loss. Existing privacy/moderation/idempotency/proxy tests stay green. External Google UI is stubbed in automated tests for reproducibility; iframe URL/title/loading and own external fallback link are checked. Runtime screenshots and Docker report are kept under ignored test-results.

Local actionlint/zizmor unavailable as previously recorded. Actual workflow syntax and runner behavior are validated by matching GitHub Actions run after push, not inferred from local test success.

Docker production build/start and all 6 BE/FE/persistence smoke checks passed. Live Google iframe rendered actual map tiles in the desktop screenshot; QR dialog and two separated postcards were visually inspected. Local Docker harness now forces IPv4 for localhost because an unrelated development app was listening on IPv6 at the same port; that unrelated app was left untouched.

## Mobile layout and readability polish — 26/11/2026

Scope requested: make the invitation look and read better on phones. Desktop rules were left untouched; all changes live in one `@media(max-width:760px)` layer at the end of `src/app/globals.css`.

- Header: sticky cream bar on phones with readable 11.5px nav links, 44px link targets, 40px RSVP pill and slightly larger wordmark. Desktop stays non-sticky.
- Hero: one-line meta kept readable by fading the campus band under it; both CTAs are full-width 52px buttons; body copy 15px/1.72, tighter top spacing, larger portrait frame.
- Type floor: removed most sub-11px text. Nav, eyebrows, ticket top/footer, event facts, landscape captions, memory captions, response labels, form notes and the consent explanation were raised; `small` inside the consent label no longer shrinks below ~11.9px.
- Rhythm: campus, ticket, story, letter, guest wishes, response and venue paddings tightened; total mobile height dropped from ~11,346px to ~10,537px at 390 without removing content.
- Ticket: full-width two-column action row; footer is now legible.
- Forms: labels 13px, inputs stay 16px (no iOS zoom), checkbox copy 12.5px, submit buttons full width and 52px tall, larger scroll margin under the floating dock.
- Venue: full-width directions button; "Mở Google Maps" is now an outlined pill matching "Sao chép địa chỉ".
- Footer: extra padding so the floating dock no longer covers the coffee/QR note; dock itself keeps 44px targets and only tightens gaps.
- Story stage reduced from 85svh/530px to 70svh/470px so the 3D scene does not leave a full empty screen on phones.

### CTA polish — 26/11/2026

- Removed the inherited link underline on the hero secondary CTA; it is now a cream gradient pill with the down arrow in a dark circular badge (orange on hover/focus), full-width on phones with the badge pushed to the right.
- Wish suggestion buttons became dashed soft-green rows with a sparkle badge and a trailing plus. Decorative spans are `aria-hidden`, so the accessible name and the exact-name test are unchanged.

Verified: lint passed, production build passed, 22/22 Playwright tests passed (51.9s) at 360/390/768/1440 including axe, no-JS, dock, form, moderation, scroll and 3D checks; `scrollWidth === clientWidth` at 360/390/1440; screenshots at 360/390 and desktop 1440 inspected under ignored `test-results/mobile-audit` and `test-results/mobile-final`. Real-device font rendering and iOS safe areas were not re-tested on hardware.
