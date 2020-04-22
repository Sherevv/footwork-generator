import Vue from 'vue';
import Component from 'vue-class-component';
import {NavbarComponent} from '../navbar';
import {SocBtnsComponent} from '../soc-btns';
import Footer from '../../partials/infooter.vue';

@Component({
    template: `<div id="app-main">
    <it-navbar></it-navbar>

    <main class="container">
        <div class="container-main">
            <div class="middle">
                <router-view>loading...</router-view>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="infooter rr">
           ${Footer}
        </div>
    </footer>
</div>`,
    components: {
        'it-navbar': NavbarComponent,
        'it-socbtns': SocBtnsComponent
    },
})
export default class App extends Vue {
}