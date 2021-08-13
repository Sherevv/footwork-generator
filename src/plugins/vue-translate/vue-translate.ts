import { EventBus } from "@/plugins/event-bus";
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $translate: any
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
    translationLoading = {};
    commonModules: string[] = [];
    activeModule = '';
    vt: any;

    lang(): string {
        return this.current;
    }

    // Current locale values
    locale(): any {
        if (!this.locales[this.current])
            return {};

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

        if (!module)
            return;

        if (!this.current)
            return;

        const lang = this.current;

        if (this.modulesTranslation[module] && this.modulesTranslation[module][lang]) {
            return;
        }

        //const path = `../../assets/i18n/${this.current}/${module}.json`;
        const data = require('../../assets/i18n/' + lang + '/' + module + '.json');

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
        this.translationLoading[module+lang] = false;

        EventBus.$emit('locales:loaded', module);
    }

    extend (to, _from) {
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
        if (!module)
            return;

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

    translateHtmlElement(el:any): void{
        if (!el.$translateKey) {
            el.$translateKey = el.innerText;
        }
        el.innerText = this.text(el.$translateKey);
    }

    // Install the method
    install(app, options?: any) {

        this._vue = app;

        const vt = this;

        app.config.globalProperties.$translate = vt;
        app.provide('$translate', vt)

        this.langs = options['langs'] || this.langs;
        // TODO: или все же вынести на уровень роута?
        const ls = app.config.globalProperties.$ls;
        if(ls){
            const lang = ls.get("lang");
            if (!lang || this.langs.indexOf(lang) === -1) {
                this.current = this.fallback;
            }else{
                this.current = lang;
            }
        }

        EventBus.$on('language:modified', () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('on: language:modified - commonModules');
            }

            for (const module of this.commonModules) {
                this.loadLocale(module);
            }

            if(vt.module?.$refs?.collapse!== undefined){
                console.log(vt.module.$refs.collapse);
                vt.module.$refs.collapse.$forceUpdate();
                vt.module.$forceUpdate();
            }
        });

        // Mixin to read locales and add the translation method and directive
        app.mixin({
            methods: {
                // An alias for the .$translate.text method
                t(t: string): string {
                   return vt.text(t);
                }
            }
        });

        app.directive("translate", {
            mounted(el): void {
                vt.translateHtmlElement(el);
            },
            updated(el): void {
                vt.translateHtmlElement(el);
            },
        });

        EventBus.$on('locales:loaded', () => {
            if(vt.module){
                if (process.env.NODE_ENV !== 'production') {
                    console.log('on: locales:loaded - force Update');
                }
                // Rerender module and refs
                vt.module.$nextTick(() => {
                    vt.module.$forceUpdate();
                    Object.keys(vt.module.$refs).forEach(el => {
                        vt.module.$refs[el].$forceUpdate();
                    });
                });
            }
        });
    }
}

export default new VueTranslate();
