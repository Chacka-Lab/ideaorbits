# syntax=docker/dockerfile:1

FROM dhi.io/node:24-dev AS deps
WORKDIR /build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,secret=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS builder
WORKDIR /build

# PUBLIC_* env args
ARG PUBLIC_SITE_BASE_URL
ENV PUBLIC_SITE_BASE_URL=$PUBLIC_SITE_BASE_URL

ARG PUBLIC_TURNSTILE_SITE_KEY
ENV PUBLIC_TURNSTILE_SITE_KEY=$PUBLIC_TURNSTILE_SITE_KEY

# Set prod mode
ENV NODE_ENV=production

COPY . .
RUN pnpm run build

FROM dhi.io/node:24 AS runner
WORKDIR /app

# Fixed config
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

COPY --from=builder --chown=node:node /build/.output ./

USER node

EXPOSE 3000

CMD ["node", "server/index.mjs"]
