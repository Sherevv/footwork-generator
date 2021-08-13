<template>
  <a class="fork-me" href="https://github.com/Sherevv/footwork-generator" target="_blank" rel="noopener noreferrer"
     title="Fork me!"></a>
  <div>Older version 2015 <a href="/old/">here</a>.</div>
  <it-socbtns :key="$translate.current"></it-socbtns>
  <p>Copyright &copy; 2015-{{ new Date().getFullYear() }} Footwork Generator - Designed by
    <a href="https://it4t.ru/" target="_blank">it4t.ru</a></p>
</template>
<script>
import { Options, Vue } from "vue-class-component";
import SocialButtonsComponent from "@/components/soc-btns/soc-btns";

@Options({
  components: {
    'it-socbtns': SocialButtonsComponent
  },
})
export default class Footer extends Vue {
}
</script>