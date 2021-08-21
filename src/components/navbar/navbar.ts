import { Vue, Options, Prop } from 'vue-property-decorator';
import routes from '@/router/routes';

@Options({})
export default class NavbarComponent extends Vue {
    @Prop()
    links = routes;

    lang = (): string => this.$translate.lang();

    created(): void {
        if (process.env.NODE_ENV !== 'production') {
            console.log('lang: ');
            console.log('route', this.$route);
            console.log('lang', this.$route.params.lang);
            console.log(
                'lang index',
                this.$translate.langs.indexOf(this.$route.params.lang)
            );
        }

        // If lang setup in url - use it, else try to get from LocalStorage, otherwise use current
        const lang = this.$route.params.lang;
        if (lang) {
            if (lang != this.$translate.lang()) {
                if (this.$translate.langs.indexOf(lang) !== -1) {
                    // change lang
                    this.$translate.setLang(lang.toString());
                    this.$ls.set('lang', lang);
                } else {
                    // get lang from LocalStorage
                    this.trySetLangFromLocalStorage();
                }
            } else {
                this.$ls.set('lang', lang);
            }
        } else {
            // get lang from LocalStorage
            this.trySetLangFromLocalStorage();
        }

        this.$translate.setTranslationModule('common', this);

        if (this.$route.name) {
            this.$router.push({
                name: this.$route.name,
                params: { lang: this.$translate.lang() },
                query: this.$route.query,
                replace: true,
            });
        }
    }

    changeLanguage(lang: string): void {
        this.$translate.setLang(lang);
        this.$ls.set('lang', lang);

        this.$router
            .replace({ params: { lang: lang }, query: this.$route.query })
            .catch((error) => {
                if (error.name != 'NavigationDuplicated') {
                    throw error;
                }
            });
    }

    localizePath(name: string): any {
        return { name: name, params: { lang: this.$translate.lang() } };
    }

    trySetLangFromLocalStorage(): void {
        const lang = this.$ls.get('lang');
        if (
            lang &&
            lang != this.$translate.lang() &&
            this.$translate.langs.indexOf(lang) !== -1
        ) {
            // change lang
            this.$translate.setLang(lang.toString());
        } else {
            //  use current lang
            this.$ls.set('lang', this.$translate.lang());
        }
    }
}
