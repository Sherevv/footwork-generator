import Vue from 'vue';
import Component from 'vue-class-component';
import {Watch} from 'vue-property-decorator';
import routes from '../../routes';
import './nav.scss';

@Component({
    template: require('./navbar.vue')
})
export class NavbarComponent extends Vue {
    links = routes;

    lang = () => this.$translate.lang();

    @Watch('$route.path')
    pathChanged() {
        if (process.env.NODE_ENV !== 'production') {
            console.log('lang: ');
            console.log(this.$route.params);
            console.log(this.$route);
            console.log(this.$translate.langs.indexOf(this.$route.params.lang));
        }
        // If lang setup in url - use it, else use fallback
        if (this.$route.params.lang) {
            if (this.$route.params.lang != this.$translate.lang() && this.$translate.langs.indexOf(this.$route.params.lang) !== -1) {
                this.$translate.setLang(this.$route.params.lang);
            }
        } else {
            if (this.$route.name) {
                let lang = this.$ls.get('lang');
                if (!(lang && this.$translate.langs.indexOf(lang) !== -1)) {
                    lang = this.$translate.fallback;
                }
                this.$router.push({name: this.$route.name, params: {lang: lang}});
            } else {
                this.$router.push({path: '/'});
            }
        }
    }

    created() {
        this.$translate.setTranslationModule('common', this, true);
    }

    changeLanguage(lang: string) {
        this.$translate.setLang(lang);
        this.$ls.set('lang', lang);
        this.$router.replace({name: this.$route.name, params: {lang: lang}}).catch(error => {
            if (error.name != "NavigationDuplicated") {
                throw error;
            }
        });
    }

    localizePath(name: string) {
        return {name: name, params: {lang: this.$translate.lang()}};
    }
}
