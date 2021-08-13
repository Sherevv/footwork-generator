import { WebStorage } from './storage';
// eslint-disable-next-line
const _global = (typeof window !== 'undefined' ? window : global || {});

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


        let store = 'localStorage' in _global
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

// eslint-disable-next-line
_global.VueStorage = VueStorage;

export default VueStorage;