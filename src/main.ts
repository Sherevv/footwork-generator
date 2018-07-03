import Vue from 'vue';
import VueRouter from 'vue-router';
import EventBus from './plugins/event-bus';
import VueTranslate from './plugins/vue-translate';
import VueLocalStorage from 'vue-ls';
import VueClipboard from 'vue-clipboard2'
import routes from './routes';
import './styles/styles.scss';
import './element-ui.js';

import {NavbarComponent} from './components/navbar';
import {SocBtnsComponent} from './components/soc-btns';

// register plugins
Vue.use(VueClipboard);
Vue.use(VueRouter);
Vue.use(VueTranslate, {
    langs: ['en', 'ru']
});
Vue.use(EventBus);
Vue.use(VueLocalStorage);
Vue.prototype.$ver = '2018.6.28';

let router = new VueRouter({mode: 'history', routes:routes});

let vue = new Vue({
    el: '#app-main',
    router: router,
    components: {
        'it-navbar': NavbarComponent,
        'it-socbtns': SocBtnsComponent
    }
});
