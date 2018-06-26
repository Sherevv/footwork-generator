// ./components/EventBus.vue
import Vue from 'vue';
export const EventBus = new Vue();

// ./plugins/EventBus.js
export default {
    install(Vue) {
        Vue.prototype.$bus = EventBus;
    }
}