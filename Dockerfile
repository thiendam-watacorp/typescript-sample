# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Development image, copy all the files and run next
FROM node:alpine AS development
ARG DOCKER_UID
ARG DOCKER_GID

WORKDIR /app
EXPOSE 3000
ENV NODE_ENV development

RUN addgroup -g ${DOCKER_GID} -S nodejs || echo "Group with ID ${DOCKER_GID} already exists."
RUN adduser -S nextjs -u ${DOCKER_GID} || echo "Skip user creation (user with ID ${DOCKER_UID} already exists?)"
RUN chown -R ${DOCKER_UID}:${DOCKER_GID} /app
COPY . .
CMD ["yarn", "dev"]

# Production image, copy all the files and run next
FROM node:alpine AS production
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]