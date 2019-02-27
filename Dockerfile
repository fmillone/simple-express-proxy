FROM node:11

WORKDIR /usr/src/proxy

COPY package.json .
COPY package-lock.json .

RUN npm install --only=prod

COPY public/ public/
COPY dist/ dist/
COPY index.js .

ENV NODE_ENV=production
ENV HOST=0.0.0.0

ENV PUBLIC_FOLDER=
ENV PROXY_TO=127.0.0.1:3000
ENV PORT=3000
ENV INDEX_FILE=index.html

EXPOSE 3000

CMD ["node", "index.js"]
