import _Vue from 'vue';

let vm: any = null;

// The plugin

class VueTranslate {
    fallback: string;
    langs: string[];
    _vue: any;

    constructor() {
        this.fallback = 'en';
        this.langs = ['en'];
    }

    lang(): string {
        return vm.lang;
    }

    // Current locale values
    locale(): object {
        if (!vm.locales[vm.current])
            return {};

        return vm.locales[vm.current];
    }

    setLang(val: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`setLang - lang: ${val}`);
        }
        if (vm.current !== val) {
            if (vm.current === '') {
                vm.$emit('language:init', val);
            } else {
                vm.$emit('language:changed', val);
            }
        }

        vm.current = val;

        vm.$emit('language:modified', val);
    }


    // Set a locale to use
    loadLocale(module: string): any {

        if (!module)
            return;

        if (!vm.current)
            return;

        let lang = vm.current;

        if (vm.modulesTranslation[module] && vm.modulesTranslation[module][lang]) {
            return;
        }

        //const path = `${this.defaultPath}/${this.current}/${module}.json`;
        let data = require('../../assets/i18n/' + lang + '/' + module + '.json');
        if (process.env.NODE_ENV !== 'production') {
            console.log(`locales load - lang: ${lang}, module: ${module}`);
        }

        let newLocale = Object.create(vm.locales);
        if (!newLocale[lang]) {
            newLocale[lang] = {};
        }


        this._vue.util.extend(newLocale[lang], data);
        vm.locales = Object.create(newLocale);

        if (!vm.modulesTranslation[module]) {
            vm.modulesTranslation[module] = {};
        }
        vm.modulesTranslation[module][lang] = true;


        vm.$emit('locales:loaded', module);
    }


    text(t: string): string {
        if (!this.locale() || !this.locale()[t]) {
            return t;
        }
        return this.locale()[t];
    }

    setTranslationModule(module: string, common: boolean = false) {
        if (!module)
            return;

        vm.activeModule = module;

        if (common && !(module in vm.commonModules)) {
            vm.commonModules.push(module);
        }

        // If a new module add load locale on lang change
        if (!vm.modulesTranslation[module]) {
            vm.$on('language:modified', () => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('on: language:modified - activeModules');
                }
                if (vm.activeModule === module) {
                    this.loadLocale(module);
                }
            });
        }

        this.loadLocale(module);
    }

    // Install the method
    install(Vue: typeof _Vue, options?: any) {

        this._vue = Vue;

        const vt = this;
        this.langs = options['langs'] || this.langs;

        if (!vm) {
            vm = new Vue({
                data() {
                    return {
                        current: 'ru',
                        locales: {},
                        modulesTranslation: [],
                        commonModules: [],
                        activeModule: ''
                    };
                },
                computed: {
                    lang(): string {
                        return this.current;
                    }
                }
            });

            // Load translations for common modules (not Views)
            vm.$on('language:modified', () => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('on: language:modified - commonModules');
                }

                for (let module of vm.commonModules) {
                    this.loadLocale(module);
                }
            });

            //Vue.prototype.$translate = vt;
            Object.defineProperties(Vue.prototype, {
                $translate: {
                    get() {
                        return vt;
                    }
                }
            });


        }

        // Mixin to read locales and add the translation method and directive
        Vue.mixin({
            methods: {
                // An alias for the .$translate.text method
                t(t: string): string {
                    return vt.text(t);
                }
            },
            directives: {
                translate(el: any) {
                    if (!el.$translateKey) {
                        el.$translateKey = el.innerText;
                    }
                    el.innerText = vt.text(el.$translateKey);
                }
            },
            filters: {
                translate(value: string) {
                    return vt.text(value);
                }
            }
        });
    }
}

export default new VueTranslate();
