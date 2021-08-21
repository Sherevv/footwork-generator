import { EventBus } from '@/plugins/event-bus';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $translate: any;
    }
}

// The plugin
class VueTranslate {
    fallback = 'en';
    langs: string[] = ['en'];
    _vue: any;
    current = 'en';
    module: any;
    locales = {};
    modulesTranslation = [];
    commonModules: string[] = [];
    activeModule = '';

    lang(): string {
        return this.current;
    }

    // Current locale values
    locale(): any {
        if (!this.locales[this.current]) return {};

        return this.locales[this.current];
    }

    setLang(val: string) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`setLang - lang: ${val}`);
        }
        if (this.current !== val) {
            if (this.current === '') {
                EventBus.$emit('language:init', val);
            } else {
                EventBus.$emit('language:changed', val);
            }
        }
        this.current = val;
        EventBus.$emit('language:modified', val);
    }

    // Set a locale to use
    loadLocale(module: string): any {
        if (!module) return;

        if (!this.current) return;

        const lang = this.current;

        if (
            this.modulesTranslation[module] &&
            this.modulesTranslation[module][lang]
        ) {
            return;
        }

        const data = require(`../../assets/i18n/${lang}/${module}.json`);

        if (process.env.NODE_ENV !== 'production') {
            console.log(`locales load - lang: ${lang}, module: ${module}`);
        }

        const newLocale = Object.create(this.locales);
        if (!newLocale[lang]) {
            newLocale[lang] = {};
        }

        this.extend(newLocale[lang], data);
        this.locales = Object.create(newLocale);

        if (!this.modulesTranslation[module]) {
            this.modulesTranslation[module] = {};
        }
        this.modulesTranslation[module][lang] = true;

        EventBus.$emit('locales:loaded', module);
    }

    extend(to, _from) {
        for (const key in _from) {
            to[key] = _from[key];
        }
        return to;
    }

    text(t: string): string {
        if (!this.locales[this.current][t]) {
            return t;
        }
        return this.locales[this.current][t];
    }

    setTranslationModule(module: string, common: any = false) {
        if (!module) return;

        this.activeModule = module;

        if (common && !(module in this.commonModules)) {
            this.commonModules.push(module);
            this.module = common;
        }

        // If a new module add load locale on lang change
        if (!this.modulesTranslation[module]) {
            EventBus.$on('language:modified', () => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('on: language:modified - activeModules');
                }
                if (this.activeModule === module) {
                    this.loadLocale(module);
                }
            });
        }

        this.loadLocale(module);
    }

    translateHtmlElement(el: any): void {
        if (!el.$translateKey) {
            el.$translateKey = el.innerText;
        }
        el.innerText = this.text(el.$translateKey);
    }

    // Install the method
    install(app, options?: any) {
        this._vue = app;

        app.config.globalProperties.$translate = this;
        app.provide('$translate', this);

        this.langs = options['langs'] || this.langs;

        EventBus.$on('language:modified', () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('on: language:modified - commonModules');
            }

            for (const module of this.commonModules) {
                this.loadLocale(module);
            }

            if (this.module?.$refs?.collapse !== undefined) {
                this.module.$refs.collapse.$forceUpdate();
                this.module.$forceUpdate();
            }
        });

        // Mixin to read locales and add the translation method and directive
        app.mixin({
            methods: {
                // An alias for the .$translate.text method
                t: (t: string): string => {
                    return this.text(t);
                },
            },
        });

        app.directive('translate', {
            mounted: (el): void => {
                this.translateHtmlElement(el);
            },
            updated: (el): void => {
                this.translateHtmlElement(el);
            },
        });

        EventBus.$on('locales:loaded', () => {
            if (this.module) {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('on: locales:loaded - force Update');
                }
                // Rerender module and refs
                this.module.$nextTick(() => {
                    this.module.$forceUpdate();
                    Object.keys(this.module.$refs).forEach((el) => {
                        this.module.$refs[el].$forceUpdate();
                    });
                });
            }
        });
    }
}

export default new VueTranslate();
