import { TinyEmitter } from "tiny-emitter"

declare module "#app" {
    interface NuxtApp {
        $emitter: TinyEmitter;
    }
}

const emitter: TinyEmitter = new TinyEmitter()

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('emitter', emitter)
})
