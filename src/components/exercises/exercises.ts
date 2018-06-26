import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    template: require('./exercises.vue'),
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

    collapseAccordion(){
        this.activeItems = [];
        console.log(111);
    }

    unCollapseAccordion(){
        let i:any;
        for(i=1; i<5;i++){
            this.activeItems.push(i.toString());
        }

    }
}
