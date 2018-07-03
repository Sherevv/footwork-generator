import Vue from 'vue';
import Component from 'vue-class-component';
import {GenerateBtnComponent} from "../generate-btn";
import './exercises.scss';

@Component({
    template: require('./exercises.vue'),
    components: {
        'it-generate-btn': GenerateBtnComponent
    },
    data() {
        return {
            activeItems: ['1'],
        }
    }
})
export class ExercisesComponent extends Vue {
    created() {
        this.$translate.setTranslationModule('exercises', this);
    }

    activeItems: string[] = [];

    collapseAccordion() {
        this.activeItems = [];
        console.log(111);
    }

    unCollapseAccordion() {
        let i: any;
        for (i = 1; i < 5; i++) {
            this.activeItems.push(i.toString());
        }
    }
}
