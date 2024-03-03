import { MoonSeo } from './MoonSeo.js';
import fs from 'node:fs/promises';
export class ServerMoonSeo extends MoonSeo {

    constructor() {
        super();
        this.ssrManifest = fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
    }


    async configExpress (app) {
        const compression = (await import('compression')).default
        const sirv = (await import('sirv')).default
        app.use(compression())
        app.use(this.base, sirv('./dist/client', { extensions: [] }))
    }

    async doGetRender (req, res) {
        let template = await fs.readFile('./dist/client/ssr.html', 'utf-8')
        let render = (await import('../dist/server/entry-server.js')).render
        return {template, render}
    }
}