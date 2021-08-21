import { Vue, Options } from 'vue-class-component';

@Options({
    props: {
        icon: {
            type: String,
        },
        iconClass: {
            type: String,
            default: '',
        },
    },
})
export default class SvgIconComponent extends Vue {}
