import { MainViewState, ModuleInit, ShortcutKeyPressEvent } from "@structural-note/structural-core"
import { emit } from '@tauri-apps/api/event'

declare module "#app" {
    interface NuxtApp {
        $viewState: MainViewState;
    }
}

export default defineNuxtPlugin(async (nuxtApp) => {
    await ModuleInit.init(useRuntimeConfig(), [{
        key: "CommandOrControl+S",
        // cannot use $emitter here as only one window will register the shortcut & emit the event
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