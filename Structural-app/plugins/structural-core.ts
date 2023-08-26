import { ViewState } from "structural-core"

export default defineNuxtPlugin((nuxtApp) => {
    const view_state = new ViewState()
    nuxtApp.provide('viewState', view_state)
})