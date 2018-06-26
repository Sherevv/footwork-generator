import Vue from 'vue'

// extends vue/types/vue.d.ts
declare module "vue/types/vue" {
    // Extension for Vue
    interface Vue {
        $translate: any
    }
}