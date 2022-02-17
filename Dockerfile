FROM node:latest

COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN yarn

COPY . .

RUN yarn build

FROM node:latest

COPY package.json package.json
COPY tsconfig.json tsconfig.json 
RUN yarn

COPY --from=0 dist .
COPY tsconfig.json tsconfig.json


CMD ["node", "index"]
