import { WebStorage } from './storage';
// eslint-disable-next-line
const _global = window;
declare global {  interface Window {    VueStorage?: any;  }}

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $ls: any
    }
}

/**
 * @type {{install: (function(Object, Object): WebStorage)}}
 */
const VueStorage = {
    /**
     * Install plugin
     *
     * @param {Object} Vue
     * @param {Object} options
     * @returns {WebStorage}
     */
    install(app, options = {}) {
        const _options = {
            ...options,
            storage:  'local',
            name:  'ls',
        };


        const store = 'localStorage' in _global
            ? _global.localStorage
            : null;

        const ls = new WebStorage(store);

        ls.setOptions(Object.assign(ls.options, {
            namespace: '',
        }, _options || {}));
        app.config.globalProperties.$ls = ls;
        app.provide("$ls", ls);

    },
};

_global.VueStorage = VueStorage;

export default VueStorage;