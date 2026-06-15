FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies and build the Next app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000
CMD ["npm","start"]
