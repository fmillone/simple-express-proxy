import {SimpleExpressProxy} from '../src';
import request from 'supertest';
import {join} from 'path';

function randomPort() {
    return 1000 + Math.floor(Math.random() * 1000);
}

describe('SimpleExpressProxy', () => {
    jest.setTimeout(10000);

    it('works if true is truthy', () => {
        expect(true).toBeTruthy();
    });

    it('SimpleExpressProxy is instantiable', () => {
        expect(SimpleExpressProxy.withDefaultConfig())
            .toBeInstanceOf(SimpleExpressProxy);
    });

    it('should start and stop the server', async () => {
        const port = randomPort();
        const proxy = SimpleExpressProxy.withDefaultConfig({
            port,
            proxyTo: `127.0.0.1:${port}`,
            publicFolderPath: 'some/path/to/public/folder'
        });

        await proxy.start(
            server => server.close()
        );
    });

    it('should return the default index', async () => {
        // given
        const port = randomPort();
        const proxy = SimpleExpressProxy.withDefaultConfig({
            port,
            proxyTo: `127.0.0.1:${port}`,
            publicFolderPath: join(__dirname, '..', 'public')
        });
        // then
        await request(proxy.app)
            .get('/some-path')
            .expect(/this works!/)
            .expect(200);
    });
});
