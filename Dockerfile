### BUILD

FROM node:16 as build

WORKDIR /build

COPY package.json .
COPY package-lock.json .

RUN npm ci --loglevel=error
COPY . .
RUN npm run build

### START

FROM node:16

ARG PORT=PORT
ARG JWT_SECRET=JWT_SECRET
ARG JWT_LIFE_TIME=JWT_LIFE_TIME
ARG IMAGES_DIRECTORY=IMAGES_DIRECTORY

WORKDIR /app

COPY package.json .
COPY package-lock.json .

COPY --from=build /build/dist /app/dist

RUN npm install --production

ENTRYPOINT [ "node", "dist/main", "--" ]