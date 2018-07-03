import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
    template: require('./soc-btns.vue'),
    computed: {
        showRu: function () {
            return this.$translate.lang() === 'ru';
        }
    }
})
export class SocBtnsComponent extends Vue {

    url: string = 'https://fwg.it4t.ru';

    mounted() {
        let script = document.createElement('script');
        script.onload = () => {
            this.showBtns();
        };
        script.async = true;
        script.src = 'https://yastatic.net/share2/share.js';
        document.head.appendChild(script);
    }

    showBtns() {

        let content = {
            ru: {
                url: this.url,
                title: 'Генератор Футворка - внеси разнообразие в свой линди хоп бейсик!',
                description: 'Генератор Футворка для танцоров линди хопа.',
                image: this.url + '/assets/images/preview.png'
            },
            en: {}
        };
        let theme = {
            ru: {
                services: 'facebook,vkontakte,telegram,twitter,lj,odnoklassniki,moimir,gplus,viber,whatsapp,pinterest,reddit,digg,linkedin,evernote',
                limit: 4,
                lang: 'ru',
                size: 'm',
                popupDirection: 'top',
                popupPosition: 'outer'
            },
            en: {}
        };

        content.en = Object.assign({}, content.ru);
        content.en['title'] = 'Footwork Generator - variate your lindy hop basic!';
        content.en['description'] = 'The Footwork Generator for lindy hop dancers.';

        theme.en = Object.assign({}, theme.ru);
        theme.en['lang'] = 'en';

        let share = {
            ru: {},
            en: {}
        };

        try {
            this.setContentUrl(content[this.$route.params.lang]);

            share.ru = Ya.share2('ya-share-ru', {
                content: content.ru,
                theme: theme.ru
            });

            share.en = Ya.share2('ya-share-en', {
                content: content.en,
                theme: theme.en
            });

            this.$watch('$route', (to, from) => {
                this.setContentUrl(content[to.params.lang]);
                this.updateContent(share[to.params.lang], content[to.params.lang]);
                console.log(to);
            });
        } catch (e) {
        }

    }

    setContentUrl(content) {
        if ('url' in content) {
            if (this.$route.name === 'Generator') {
                content.url = this.url + this.$route.fullPath;
            } else {
                content.url = this.url;
            }
        }
    }

    updateContent(share, content) {
        share.updateContent(content);
    }
}
