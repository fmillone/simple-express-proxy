// tslint:disable-next-line:no-var-requires
const express = require('express');
import { Application } from 'express';
import proxy from 'express-http-proxy';
import { Server } from 'http';
import { join } from 'path';
import { RequestHandler } from 'express-serve-static-core';
import morgan from 'morgan';
import _ from 'lodash';

export interface Conf {
    port: number;
    proxyTo: string;
    publicFolderPath: string;
    indexFile: string;
    proxyPath: string;
}

export const defaultConf: Conf = {
    port: 3000,
    proxyTo: '127.0.0.1:3001',
    publicFolderPath: 'public',
    indexFile: 'index.html',
    proxyPath: '/api'
};

type Consumer<T> = (t: T) => void;

export class SimpleExpressProxy {

    app: Application;
    readonly staticFilesPathPattern = /\/\w+\.\w+(\.\w+)?/;

    constructor(private conf: Conf) {
        this.app = express();

        this.app.use(this.requestLogger());
        this.app.use(conf.proxyPath, proxy(conf.proxyTo));
        this.app.use('/', this.staticFilesHandler(conf));
        this.app.use(this.fallbackIndex());

    }

    static withDefaultConfig(conf: Partial<Conf> = {}): SimpleExpressProxy {
        return new SimpleExpressProxy(_.merge(defaultConf, conf));
    }

    private staticFilesHandler(conf: Conf): RequestHandler {
        return express.static(conf.publicFolderPath, {
            maxAge: 31557600000
        }, { redirect: false });
    }

    private requestLogger(): RequestHandler {
        return morgan('common', {
            skip: req =>
                req.method === 'GET' && this.staticFilesPathPattern.test(req.path)
        });
    }

    private fallbackIndex(): RequestHandler {
        return (req, res) =>
            res.sendFile(join(this.conf.publicFolderPath, this.conf.indexFile));
    }

    async start(action?: Consumer<Server>) {
        console.log('Starting server with this config:', this.conf, '\n');
        const server = await this.app.listen(this.conf.port);
        console.log(
            'App is running at http://localhost:%d in %s mode redirecting to %s',
            this.conf.port,
            this.app.get('env'),
            this.conf.proxyTo
        );
        console.log('  Press CTRL-C to stop\n');
        if (action) {
            return action(server);
        }
    }

}
