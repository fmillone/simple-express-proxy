# Simple Express Proxy
A simple express app wich serves static resources and proxy requests from /api/**

## Usage
Just create a new docker image like this one:
 ```
FROM fmillone/simple-express-proxy:latest

# copy your static assets into the public folder
COPY dist/ public/

ENV PROXY_TO=127.0.0.1:3001
ENV PORT=4200

```

## Environment Variables

* **PUBLIC_FOLDER**: relative folder inside the container. Defaults to `public`
* **PROXY_TO**: host and port of the backend you want to proxy the requests to
* **PORT**: the port wich the express app will listen. Defaults to `3000`
* **INDEX_FILE**: the default index file to return in case the requested path does not exist under the public folder. Defaults to `index.html`