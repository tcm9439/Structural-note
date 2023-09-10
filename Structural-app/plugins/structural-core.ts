import { GlobalViewState, ModuleInit } from "structural-core"

export default defineNuxtPlugin((nuxtApp) => {
    ModuleInit.init()
    const view_state = new GlobalViewState()
    nuxtApp.provide('viewState', view_state)
})