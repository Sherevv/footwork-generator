declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'debounce';

import Vue from 'vue'

// extends vue/types/vue.d.ts
declare module "vue/types/vue" {
    // Extension for Vue
    interface Vue {
        $ls: any;
        $ver: string;
        $copyText: any;
    }
}
