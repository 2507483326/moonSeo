import './assets/main.css'

import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createRouter } from './router';


export function createApp() {
    const vm = createSSRApp(App)
    const pina = createPinia()
    const router = createRouter();

    vm.use(pina)
    vm.use(router)
    return { vm, router}
}

