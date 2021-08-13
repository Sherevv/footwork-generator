import { Vue, Options, Watch, Prop } from 'vue-property-decorator';
import routes from '@/router/routes';


@Options({})
export default class NavbarComponent extends Vue {
    @Prop()
    links = routes;

    lang = () => this.$translate.lang();

    @Watch('$route.path')
    pathChanged() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('lang: ');
            console.log('route', this.$route);
            console.log('query', this.$route.params);
            console.log('lang index', this.$translate.langs.indexOf(this.$route.params.lang));
        }
        // If lang setup in url - use it, else use fallback
        let lang = this.$route.params.lang;
        if (lang) {
            if (lang != this.$translate.lang() && this.$translate.langs.indexOf(lang) !== -1) {
                this.$translate.setLang(lang.toString());
            }
        } else {
            lang = this.$translate.lang();
            if (this.$route.name) {
                this.$router.push({
                    name: this.$route.name,
                    params: {lang: lang},
                    query: this.$route.query,
                    replace: true
                });
            } else {
                this.$router.push({path: '/'});
            }
        }
    }

    created() {
        this.$translate.setTranslationModule('common', this);
    }

    changeLanguage(lang: string) {
        this.$translate.setLang(lang);
        this.$ls.set('lang', lang);

        let route = this.$route.name;
        if (route == null) {
            route = undefined;
        }

        this.$router.replace({name: route, params: {lang: lang}, query: this.$route.query}).catch(error => {
            if (error.name != "NavigationDuplicated") {
                throw error;
            }
        });
    }

    localizePath(name: string) {
        return {name: name, params: {lang: this.$translate.lang()}};
    }
}
