import { Vue, Options, Prop } from "vue-property-decorator";
import { EMAIL } from '@/config';
import ContactFormComponent from "../contact-form";
import SvgIconComponent from "@/ui/svgicon/svgicon.vue";


@Options({
    components: {
        'it-contact-form': ContactFormComponent,
        'it-svgicon': SvgIconComponent
    }
})
export default class AboutComponent extends Vue {
    @Prop()
    ml = '';

    created() {
        this.$translate.setTranslationModule('about', this);
    }

    mounted() {
        this.ml = EMAIL;
    }
}
