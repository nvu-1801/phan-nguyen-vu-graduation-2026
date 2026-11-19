# Graduation implementation handoff

Read docs/graduation/IMPLEMENTATION_PLAN.md and SOURCE_MANIFEST.md before implementing. This repository is a bootstrap, not an already working application. Preserve the user's two photographs and use the included motion kit selectively. Never report old portfolio checks as graduation app verification.

Select the included ui-design, scroll-storytelling and web-3d-scenes skill instructions for the relevant work. Fetch additional backend/release skills from the pinned upstream repository only when needed; do not install unrelated services.

Check actual Codex account quota at start, before major phases and approximately every 15 minutes using get_usage_limits when available. Remaining is 100 minus usedPercent. If an applicable window is below 5%, stop new work, finish the smallest safe in-flight operation, and update CONTINUE.md with objective, constraints, repository/path/branch/SHA, modified files, actual commands/results, blockers, process/session IDs and next concrete steps. Never include secrets. Do not push/deploy or skip checks just to beat quota. If quota is unavailable, say so and continue authorized work.

Do not commit environment secrets, real databases, node_modules or generated build output. Never seed fixtures into production. Public guest and wish data require explicit consent; wishes additionally require approval. Vercel deployment requires a persistent remote SQLite-compatible database or separately hosted SQLite backend; a temporary filesystem is insufficient.
