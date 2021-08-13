declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'debounce';


declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $ls: any;
    }
}