import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
const path = '.env.docker.local';
if (existsSync(path)) {
  console.log('Existing local Docker configuration retained.');
} else {
  writeFileSync(path, `APP_ENV_FILE=.env.docker.local\nAPP_PORT=3020\nSITE_ORIGIN=http://localhost:3020\nNEXT_PUBLIC_SITE_URL=http://localhost:3020\nTRUST_PROXY=0\nRATE_LIMIT_SECRET=${randomBytes(32).toString('hex')}\n`, {flag:'wx',mode:0o600});
  console.log('Created .env.docker.local with a random secret. File is ignored by Git.');
}
