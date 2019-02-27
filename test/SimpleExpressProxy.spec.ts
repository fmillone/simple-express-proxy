import { SimpleExpressProxy } from "../src/SimpleExpressProxy";
import request from "supertest";
import { join } from "path";

function randomPort(){
    return 1000 + Math.floor(Math.random() * 1000);
}

describe("SimpleExpressProxy", () => {
    jest.setTimeout(10000);

    it("works if true is truthy", () => {
        expect(true).toBeTruthy()
    })

    it("SimpleExpressProxy is instantiable", () => {
        expect(new SimpleExpressProxy({
            port: 3000,
            backend: 'localhost:3000',
            publicFolderPath: '/some/path/to/public/folder',
            indexFile: 'index.html'
        })).toBeInstanceOf(SimpleExpressProxy)
    })

    it('should start and stop the server', async () => {
        const port = randomPort();
        const proxy = new SimpleExpressProxy({
            port: port,
            backend: `localhost:${port}`,
            publicFolderPath: 'some/path/to/public/folder',
            indexFile: 'index.html'
        });

        await proxy.start(
            server => server.close()
        )
    });

    it('should return the default index', async ()=> {
        // given
        const port = randomPort();
        console.log(join(__dirname, 'public'))
        const proxy = new SimpleExpressProxy({
            port: port,
            backend: `localhost:${port}`,
            publicFolderPath: join(__dirname, '..', 'public'),
            indexFile: 'index.html'
        });
        // then
        await request(proxy.app)
            .get('/some-path')
            .expect(/this works!/)
            .expect(200)
    });
})
