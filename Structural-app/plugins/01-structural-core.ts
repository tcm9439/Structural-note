import { MainViewState, ModuleInit } from "structural-core"
import { NoteFileHandler, EditHistoryHandler } from "@/composables/file/NoteFileHandler"

export default defineNuxtPlugin(async (nuxtApp) => {
    ModuleInit.init(
        useRuntimeConfig(),
        () => NoteFileHandler.saveNote(false),
        EditHistoryHandler.undo,
        EditHistoryHandler.redo,
    )
    const view_state = new MainViewState()
    nuxtApp.provide('viewState', view_state)
})