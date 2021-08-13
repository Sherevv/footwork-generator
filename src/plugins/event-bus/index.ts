import emitter from 'tiny-emitter/instance'

export const EventBus = {
    $on: (...args) => emitter.on(...args),
    $once: (...args) => emitter.once(...args),
    $off: (...args) => emitter.off(...args),
    $emit: (...args) => emitter.emit(...args)
}

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $bus: any
    }
}

export default {
    install(app) {
        app.config.globalProperties.$bus = EventBus;
    }
}