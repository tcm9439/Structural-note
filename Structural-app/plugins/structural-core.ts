import { MainViewState, ModuleInit } from "structural-core"

export default defineNuxtPlugin((nuxtApp) => {
    ModuleInit.init(useRuntimeConfig())
    const view_state = new MainViewState()
    nuxtApp.provide('viewState', view_state)
})