<!-- 
    Home page of the app. 
    - Initial value: any opened note (passed from another window)?
        - If no note is opened, show a modal for creating / opening a note
        - If a note is opened, show the note
 -->

<script setup lang="ts">
import { Note, EventConstant, AppState, AppPage } from "structural-core"
import { NoteFileHandler } from "@/composables/file/NoteFileHandler"
const { $emitter, $viewState, $Modal } = useNuxtApp()
import { appWindow } from "@tauri-apps/api/window"
import { invoke } from "@tauri-apps/api/tauri"
import { Icon } from "view-ui-plus"
import { exceptionHandler } from "@/composables/app/exception"
import { tran } from "~/composables/app/translate"

const editing_note = ref<Note|null>(null)
const has_open_note = ref<boolean>(false)

// # listen to the note open / close event (from here or the menu)
function openedNoteChangeHandler(){
    AppState.logger.debug("Note open / change event.")
    editing_note.value = $viewState.editing_note
    has_open_note.value = editing_note.value != null
}
$emitter.on(EventConstant.NOTE_OPENED, openedNoteChangeHandler)
$emitter.on(EventConstant.NOTE_CLOSED, openedNoteChangeHandler)

// # init page: check if there is any opened note for this window
const window_id = appWindow.label
try {
    if ($viewState.editing_note != null){
        // already opened a note (probably from go back in this page from another page)
        editing_note.value = $viewState.editing_note
        has_open_note.value = true
    } else {
        has_open_note.value = await NoteFileHandler.openInitNoteForThisWindow(window_id)
        AppState.logger.debug(`Has open note: ${has_open_note.value}`)
    }
} catch (error) {
    exceptionHandler(error, "error.general.open_note")
}

// # listen to the file drop event
const unlisten_drop_file = await appWindow.onFileDropEvent(async (event) => {
    AppState.logger.debug(`Got event in window ${event.windowLabel}, payload: ${event.payload}`)
    try {
        if (event.payload.type != "drop"){
            return
        }
        let selected_open_path = NoteFileHandler.getPathFromSelectedFiles(event.payload.paths)
        AppState.logger.debug(`Selected open path: ${selected_open_path}`)
        await NoteFileHandler.openNote(window_id, !has_open_note.value, selected_open_path)
    } catch (error) {
        exceptionHandler(error, "error.general.open_note")
    }
})

// # listen to close window request event
const unlisten_close_window = await appWindow.onCloseRequested(async (event) => {
    AppState.logger.info("Close window request.")
    event.preventDefault()
    if (editing_note.value != null){
        await NoteFileHandler.closeNote(async () => {
            // close Logger
            await AppState.logger.close()
            appWindow.close()
        }, () => {
            // prevent closing
        })
    }
})

onBeforeUnmount(() => {
    $emitter.off(EventConstant.NOTE_OPENED, openedNoteChangeHandler)
    $emitter.off(EventConstant.NOTE_CLOSED, openedNoteChangeHandler)
    unlisten_drop_file()
    unlisten_close_window()
    invoke("remove_opened_file", { windowId: window_id })
})

</script>

<template>
    <!-- For creating / opening a note -->
    <mt-layout-home-init-note v-if="!has_open_note" />

    <!-- After a note is opened -->
    <div v-if="has_open_note">
        <!-- Loading the note-->
        <div v-if="editing_note == null" class="spin-container">
            <Spin fix>
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>{{ tran("common.loading") }}</div>
            </Spin>
        </div>
        <mt-note v-else :note="editing_note" />
    </div>
</template>

<style scoped>
    .spin-container{
        display: inline-block;
        width: 100%;
        height: 87vh;
        position: relative;
    }
</style>