import { Vue, Options, Prop } from 'vue-property-decorator';
import GenerateBtnComponent from '../generate-btn';

@Options({
    components: {
        'it-generate-btn': GenerateBtnComponent,
    },
})
export default class ExercisesComponent extends Vue {
    @Prop()
    activeItems: string[] = ['1'];

    created(): void {
        this.$translate.setTranslationModule('exercises', this);
    }

    collapseAccordion(): void {
        this.activeItems = [];
    }

    unCollapse(): void {
        let i: any;
        this.activeItems = [];
        for (i = 1; i < 5; i++) {
            this.activeItems.push(i.toString());
        }
    }
}
