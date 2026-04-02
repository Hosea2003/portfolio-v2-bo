# ---- Build stage ----
FROM node:22-alpine AS build

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

ENV NODE_ENV=production
RUN npm run build

# ---- Production stage ----
FROM node:22-alpine

RUN apk add --no-cache vips-dev

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --omit=dev

COPY --from=build /app/dist ./dist

COPY config ./config
COPY database ./database
COPY public ./public
COPY src ./src
COPY tsconfig.json ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

CMD ["npm", "run", "start"]
