import './assets/main.css'

import { createSSRApp, createApp as _createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createRouter } from './router';


export function createApp() {
    const vm = import.meta.env.SSR || import.meta.env.VITE_RENDER_MODE == 'ssr' ? createSSRApp(App) : _createApp(App);
    const pina = createPinia()
    const router = createRouter();

    vm.use(pina)
    vm.use(router)
    return { vm, router}
}

