import { Vue, Options, Prop } from 'vue-property-decorator';
import SvgIconComponent from '@/ui/svgicon';

@Options({
    components: {
        'it-svgicon': SvgIconComponent,
    },
})
export default class GenerateBtnComponent extends Vue {
    @Prop(String) b: string;
    @Prop(String) n: string;

    goToGenerator(): void {
        this.$router.push({
            name: 'Generator',
            params: { lang: this.$translate.lang() },
            query: { b: this.b, n: this.n },
        });
    }
}
