import { Vue, Options } from 'vue-class-component';
import { useRoute } from 'vue-router';
import { SITE_URL } from '@/config';

declare const Ya; // for Yandex Share

interface Share {
    updateContent: any;
}

interface Content {
    url: string;
    title: string;
    description: string;
    image: string;
}

@Options({})
export default class SocialButtonsComponent extends Vue {
    url = SITE_URL;
    route = useRoute();
    showRu = true;

    mounted(): void {
        const script = document.createElement('script');
        script.onload = () => {
            this.showBtns();
        };
        script.async = true;
        script.src = 'https://yastatic.net/share2/share.js';
        document.head.appendChild(script);
    }

    showBtns(): void {
        const content = {
            ru: {
                url: this.url,
                title: 'Генератор Футворка - внеси разнообразие в свой линди хоп бейсик!',
                description: 'Генератор Футворка для танцоров линди хопа.',
                image: this.url + '/assets/images/preview.png',
            },
            en: {},
        };
        const theme = {
            ru: {
                services:
                    'facebook,vkontakte,telegram,twitter,lj,odnoklassniki,moimir,gplus,viber,whatsapp,pinterest,reddit,digg,linkedin,evernote',
                limit: 4,
                lang: 'ru',
                size: 'm',
                popupDirection: 'top',
                popupPosition: 'outer',
            },
            en: {},
        };

        content.en = Object.assign({}, content.ru);
        content.en['title'] =
            'Footwork Generator - variate your lindy hop basic!';
        content.en['description'] =
            'The Footwork Generator for lindy hop dancers.';

        theme.en = Object.assign({}, theme.ru);
        theme.en['lang'] = 'en';

        const share = {
            ru: {},
            en: {},
        };

        try {
            if (this.route.params.lang) {
                let lang;
                if (typeof this.route.params.lang === 'string') {
                    lang = this.route.params.lang;
                } else {
                    lang = this.route.params.lang[0];
                }

                this.showRu = lang === 'ru';
                this.setContentUrl(content[lang]);
            }

            share.ru = Ya.share2('ya-share-ru', {
                content: content.ru,
                theme: theme.ru,
            });

            share.en = Ya.share2('ya-share-en', {
                content: content.en,
                theme: theme.en,
            });

            this.$watch('$route', (to) => {
                this.setContentUrl(content[to.params.lang]);
                this.updateShareContent(
                    share[to.params.lang],
                    content[to.params.lang]
                );
                this.showRu = to.params.lang === 'ru';
            });
        } catch (e) {
            if (process.env.NODE_ENV === 'development') {
                console.error(e);
            }
        }
    }

    setContentUrl(content: Content): void {
        if (content && 'url' in content) {
            if (this.$route.name === 'Generator') {
                content.url = this.url + this.$route.fullPath;
            } else {
                content.url = this.url;
            }
        }
    }

    updateShareContent(share: Share, content: Content): void {
        if (share) {
            share.updateContent(content);
        }
    }
}
