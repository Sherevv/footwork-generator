import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {SvgIconComponent} from "../../ui/svgicon";
import './generate-btn.scss';

@Component({
    template: require('./generate-btn.vue'),
    components: {
        'it-svgicon': SvgIconComponent
    }
})
export class GenerateBtnComponent extends Vue {
    @Prop(String) b: string;
    @Prop(String) n: string;

    goToGenerator() {
        this.$router.push({name: "Generator", params: {lang: this.$translate.lang()}, query: {b: this.b, n: this.n}});
    }
}
