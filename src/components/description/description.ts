import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    template: require('./description.vue'),
})
export class DescriptionComponent extends Vue {
    created() {
        this.$translate.setTranslationModule('description',this);
    }
}
