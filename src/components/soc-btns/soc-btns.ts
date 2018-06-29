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
            url: 'http://fwg.it4t.ru/',
            title: 'Генератор Футворка - внеси разнообразие в свой линди хоп бейсик!',
            description: 'Генератор Футворка для танцоров линди хопа.',
            image: 'http://fwg.it4t.ru/assets/images/preview.png'
        };
        let theme = {
            services: 'facebook,vkontakte,telegram,twitter,lj,odnoklassniki,moimir,gplus,viber,whatsapp,pinterest,reddit,digg,linkedin,evernote',
            limit: 4,
            lang: 'ru',
            size: 'm',
            popupDirection: 'top',
            popupPosition: 'outer'
        };

        try {
            Ya.share2('ya-share-ru', {
                content,
                theme
            });

            content['title'] = 'Footwork Generator - variate your lindy hop basic!';
            content['description'] = 'The Footwork Generator for lindy hop dancers.';
            theme['lang'] = 'en';


            Ya.share2('ya-share-en', {
                content,
                theme
            });
        }catch (e) {}
    }
}
