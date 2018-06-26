import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import '../../ui/svgicon';

@Component({
    template: require('./svgicon.vue'),
    props: {
        icon: {
            type: String,
        },
        iconClass: {
            type: String,
            default:''
        },
    }
})
export class SvgIconComponent extends Vue {
}
