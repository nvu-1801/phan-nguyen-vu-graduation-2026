FROM node:24-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build && mkdir -p /app/data && chown -R node:node /app
USER node
ENV NODE_ENV=production
EXPOSE 3000
CMD ["sh", "-c", "npm run db:migrate && npm start -- -H 0.0.0.0"]
