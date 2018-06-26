import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    template: require('./changes.vue'),
})
export class ChangesComponent extends Vue {
    created() {
        this.$translate.setTranslationModule('changes', this);
    }
}
