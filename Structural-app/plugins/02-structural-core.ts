import { MainViewState, ModuleInit } from "structural-core"
import { ShortcutKeyPressEvent } from "structural-core"
import { emit } from '@tauri-apps/api/event'

export default defineNuxtPlugin(async (nuxtApp) => {
    await ModuleInit.init(useRuntimeConfig(), [{
        key: "CommandOrControl+S",
        callback: () => emit(ShortcutKeyPressEvent.SAVE),
    }, {
        // not use "ctrl + Z" as it will conflict with iviewUI form item undo
        key: "CommandOrControl+U",
        callback: () => emit(ShortcutKeyPressEvent.UNDO),
    }, {
        key: "CommandOrControl+shift+U",
        callback: () => emit(ShortcutKeyPressEvent.REDO),
    }])
    const view_state = new MainViewState()
    nuxtApp.provide('viewState', view_state)
})