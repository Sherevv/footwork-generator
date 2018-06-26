import Vue from 'vue';
import Component from 'vue-class-component';
import {ContactFormComponent} from "../contact-form";
import {SvgIconComponent} from "../../ui/svgicon";
import {EMAIL} from '../../config';


@Component({
    template: require('./about.vue'),
    components:{
        'it-contact-form': ContactFormComponent,
        'it-svgicon': SvgIconComponent
    },
    data(){
        return {
            ml: ''
        }
    }
})
export class AboutComponent extends Vue {

    ml:string;

    created() {
        this.$translate.setTranslationModule('about', this);
    }

    mounted() {
        this.ml = EMAIL;
    }
}
