import EventBus from './plugins/event-bus';
import VueTranslate from './plugins/vue-translate';
import VueLocalStorage from './plugins/localstorage'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import vueHeadful from './plugins/vue-headful/vue-headful';
import './styles/styles.scss';
import {App} from './components/app';
import './registerServiceWorker';

import { createApp } from 'vue/dist/vue.runtime.esm-bundler';
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App);

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $ls: any,
        $ver: any,
        $copyText: any
    }
}

app.use(EventBus);
app.use(VueLocalStorage);
app.use(VueTranslate, {
    langs: ['en', 'ru']
});
app.use(VueClipboard);
app.use(ElementPlus);

app.component('vue-headful', vueHeadful);

app.use(router).mount("#app");