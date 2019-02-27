const express = require("express");
import { Application } from "express";
import proxy from 'express-http-proxy';
import { Server } from "http";
import { join } from "path";
import { RequestHandler } from "express-serve-static-core";
import morgan from "morgan";

interface Conf {
    port: number;
    backend: string;
    publicFolderPath: string;
    indexFile: string;
}

type Consumer<T> = (t: T) => void;

export class SimpleExpressProxy {

    app: Application;
    readonly regex = /\/\w+\.\w+(\.\w+)?/;

    constructor(private conf: Conf) {
        this.app = express();
        this.app.set("port", conf.port);

        this.app.use(this.requestLogger());
        this.app.use('/api', proxy(conf.backend))
        this.app.use('/',this.staticFilesHandler(conf));
        this.app.use(this.fallbackIndex());

    }

    private staticFilesHandler(conf: Conf): RequestHandler {
        return express.static(conf.publicFolderPath, {
            maxAge: 31557600000
        }, { redirect: false });
    }

    private requestLogger(): RequestHandler {
        return morgan('common', {
            skip: (req) => req.method === 'GET' && this.regex.test(req.path)
        });
    }

    private fallbackIndex(): RequestHandler {
        return (_, res) =>
            res.sendFile(join(this.conf.publicFolderPath, this.conf.indexFile));
    }

    async start(action?: Consumer<Server>) {
        const server = await this.app.listen(this.app.get("port"));
        console.log(
            "  App is running at http://localhost:%d in %s mode redirecting to %s",
            this.app.get("port"),
            this.app.get("env"),
            this.conf.backend
        );
        console.log("  Press CTRL-C to stop\n");
        if (action) {
            return action(server);
        }
    }

}
