import axios from 'axios';


axios.interceptors.request.use(
    (config) => {
        handlerGetSsrData(config);
        return config;
    }
);

axios.interceptors.response.use(
    (response) => {
        let data = response.data;
        handlerSaveSsrData(response, data)
        return Promise.resolve(data);
    }
)


function handlerSaveSsrData (response, data) {
    if (import.meta.env.SSR) {
        // 如果页面需要 ssr 则把数据放入 global 中
        global.dataMap[getSsrDataKey(response.config)] = data
    }
}

function handlerGetSsrData (config) {
    if(import.meta.env.SSR) {
        return null
    }
    if (window.dataMap && window.dataMap[getSsrDataKey(config)]) {
        // 拿到 window 上传入的请求数据
        let data = window.dataMap[getSsrDataKey(config)];
        // 通过适配器，返回缓存数据
        config.adapter = () => {
            // 前端获取完数据后清空该数据，后续请求从 API 端获取最新数据
            window.dataMap[getSsrDataKey(config)] = null
            return Promise.resolve({
                data,
                status: 200,
                statusText: '',
                headers: config.headers,
                config: {
                    ...config,
                    isCache: true,
                },
                request: config,
            });
        };
    }
}

function getSsrDataKey(config) {
    // 将请求 url、data、params 作为 key 返回
    return JSON.stringify({
        url: config.url,
        // 这里很奇怪，后台变成字符串了
        data: config.data == null ?  null : typeof config.data == 'string' ? config.data : JSON.stringify(config.data),
        params: config.params
    })
}


export default axios