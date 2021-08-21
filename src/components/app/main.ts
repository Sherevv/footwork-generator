import { Vue, Options } from 'vue-class-component';
import NavbarComponent from '../navbar';
import Footer from '@/partials/infooter.vue';

@Options({
    template: `
      <div id="app-main">
      <it-navbar></it-navbar>

      <main class="container">
        <div class="container-main">
          <div class="middle">
            <router-view/>
          </div>
        </div>
      </main>

      <footer class="footer">
        <div class="infooter rr">
          <it-footer></it-footer>
        </div>
      </footer>
      </div>`,
    components: {
        'it-navbar': NavbarComponent,
        'it-footer': Footer,
    },
})
export default class App extends Vue {}
