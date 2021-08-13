import { Vue, Options } from 'vue-class-component';

@Options({})
export default class DescriptionComponent extends Vue {
    created(): void {
        this.$translate.setTranslationModule('description', this);
    }
}
