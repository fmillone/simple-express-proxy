const { SimpleExpressProxy }= require("./dist/src");
const path = require("path")


SimpleExpressProxy.withDefaultConfig({
    port: process.env.PORT,
    backend: process.env.PROXY_TO,
    publicFolderPath: path.join(__dirname, process.env.PUBLIC_FOLDER || 'public'),
    indexFile: process.env.INDEX_FILE,
    proxyPath: process.env.PROXY_PATH
}).start();
