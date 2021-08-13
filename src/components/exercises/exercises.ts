import { Vue, Options, Prop } from "vue-property-decorator";
import GenerateBtnComponent from "../generate-btn";

@Options({
    components: {
        'it-generate-btn': GenerateBtnComponent
    },
})
export default class ExercisesComponent extends Vue {
    created() {
        this.$translate.setTranslationModule('exercises', this);
    }

    @Prop()
    activeItems: string[] = ['1'];

    collapseAccordion() {
        this.activeItems = [];
    }

    unCollapse() {
        console.log(this.activeItems);
        let i: any;
        this.activeItems = [];
        for (i = 1; i < 5; i++) {
            this.activeItems.push(i.toString());
        }
    }
}
