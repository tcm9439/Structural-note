import { TinyEmitter } from "tiny-emitter"

const emitter: TinyEmitter = new TinyEmitter()

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('emitter', emitter)
})
