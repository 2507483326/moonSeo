import { MoonSeo } from './MoonSeo.js';
import fs from 'node:fs/promises';
export class LocalMoonSeo extends MoonSeo {

    constructor() {
        super();
        this.vite = null
    }


    async configExpress (app) {
        const { createServer } = await import('vite')
        this.vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
            mode: 'dev',
            base: this.base
        })
        app.use(this.vite.middlewares)
    }

    async doGetRender (req, res) {
        const url = req.originalUrl.replace(this.base, '')
        let template = await fs.readFile('./index.html', 'utf-8')
        template = await this.vite.transformIndexHtml(url, template)
        let render = (await this.vite.ssrLoadModule('./src/entry-server.js')).render
        return {template, render}
    }
}