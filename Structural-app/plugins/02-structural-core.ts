import { MainViewState, ModuleInit } from "@structural-note/structural-core"
import { emit } from '@tauri-apps/api/event'

declare module "#app" {
    interface NuxtApp {
        $viewState: MainViewState;
    }
}

export default defineNuxtPlugin(async (nuxtApp) => {
    await ModuleInit.init(useRuntimeConfig())
    const view_state = new MainViewState()
    nuxtApp.provide('viewState', view_state)
})