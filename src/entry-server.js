import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';

export async function render({ req, url, manifest }) {
    let html = ''
    let head = ''
    try {
        const { vm, router } = createApp();
        // 等待路由导航成功
        await router.push(url);
        await router.isReady();
        // 判断路由的 meta 上是否包含需要 ssr 的页面，只有需要的才会进行渲染
        if (router?.currentRoute?.value?.meta?.isSsr) {
            const ctx = {};
            // 将 vue 实例渲染成 html
            html = await renderToString(vm, ctx);
            // 获取该页面所需要的相关资源，如css、js等，这里主要是为了解决打开页面后样式没有被加载的问题
            head = renderPreloadLinks(ctx.modules, manifest);
        }
        console.log('页面渲染成功');
    } catch (err) {
        console.error('页面渲染出错!');
        console.error(err);
    }
    // dataMap 涉及到水合相关代码，后面会讲到
    console.log(global.dataMap)
    return { head, html, dataMap: JSON.stringify(global.dataMap) };
}
/**
 * 获取所需要的静态资源
 */
export function renderPreloadLinks(modules, manifest) {
    if (manifest == null) {
        return '';
    }
    let links = '';
    const seen = new Set();
    modules.forEach((id) => {
        const files = manifest[id];
        if (files) {
            files.forEach((file) => {
                if (!seen.has(file)) {
                    seen.add(file);
                    const filename = basename(file);
                    if (manifest[filename]) {
                        for (const depFile of manifest[filename]) {
                            links += renderPreloadLink(depFile);
                            seen.add(depFile);
                        }
                    }
                    links += renderPreloadLink(file);
                }
            });
        }
    });
    return links;
}

function renderPreloadLink(file) {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`;
    } else if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
    } else if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
    } else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
    } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
    } else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
    } else {
        // TODO
        return '';
    }
}