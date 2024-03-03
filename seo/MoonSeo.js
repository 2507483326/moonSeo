import express from 'express';
import artTemplate from 'art-template';
export class MoonSeo {

    constructor () {
        this.app = express()
        this.port = 3000
        this.ssrManifest = null
        this.base =  process.env.BASE || '/'
    }


    async doDrawBanner () {
        console.log('启动中...')
    }

    /**
     * 配置express
     * @param app
     * @returns {Promise<void>}
     */
    async configExpress (app) {
        // 由子类实现
    }

    /**
     * 请求渲染方法
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    async doGetRender (req, res) {
        // 由子类实现
    }


    async start () {
        await this.doDrawBanner();
        await this.configExpress(this.app);
        await this.addListener()
        await this.startExpress()
    }

    async addListener () {
        // 监听所有请求
        this.app.use('*', async (req, res) => {
            try {
                global.dataMap = {}
                const url = req.originalUrl.replace(this.base, '')
                let {template, render} =  await this.doGetRender(req, res);
                // 调用子类返回的render函数
                const model = await render({
                    req,
                    res,
                    url,
                    ssrManifest: this.ssrManifest
                })
                // 这里使用 artTemplate 来进行数据渲染
                let html = artTemplate.render(template, model)
                res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
            } catch (err) {
                res.status(500).end('服务器出现错误')
            }
        })
    }

    async startExpress () {
        // 启动服务
        this.app.listen(this.port, () => {
            console.log(`启动成功`)
            console.log(`Server started at http://localhost:${this.port}`)
        })
        // 监听延迟异常，注意这里需要捕获一些由于setTimeout、promise 等未知异常导致程序崩溃
        process.on('uncaughtException', function(err) {
            console.error('===================== 捕获未知延迟异常开始 =============================>' );
            console.error(err)
            console.error('<===================== 捕获未知延迟异常结束 =============================' );
        });
    }
}