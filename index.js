const { SimpleExpressProxy }= require("./dist/src");
const path = require("path")


new SimpleExpressProxy({
    port: process.env.PORT || 3000,
    backend: process.env.PROXY_TO || 'localhost:3000',
    publicFolderPath: path.join(__dirname, process.env.PUBLIC_FOLDER || "public"),
    indexFile: process.env.INDEX_FILE || 'index.html'
}).start();
