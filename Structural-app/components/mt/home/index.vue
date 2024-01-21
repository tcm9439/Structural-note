<!-- 
    Home page of the app. 
    - Initial value: any opened note (passed from another window)?
        - If no note is opened, show a modal for creating / opening a note
        - If a note is opened, show the note
 -->

<script setup lang="ts">
import { Note, EventConstant, AppState, AppPage } from "@structural-note/structural-core"
import { NoteFileHandler } from "@/composables/handler/NoteFileHandler"
const { $emitter, $viewState } = useNuxtApp()
import { appWindow } from "@tauri-apps/api/window"
import { invoke } from "@tauri-apps/api/tauri"
import { Icon } from "view-ui-plus"
import { exceptionHandler } from "@/composables/app/exception"
import { tran } from "~/composables/app/translate"

const editing_note = ref<Note|null>(null) as Ref<Note|null>
const has_open_note = ref<boolean>(false)
const loading = ref<boolean>(true)
const no_error = ref<boolean>(true)
const closing_note = ref<boolean>(false)
const closing_note_success_callback = ref(() => {})
const closing_note_cancel_callback = ref(() => {})

// # listen to the note open / close event (from here or the menu)
function openedNoteChangeHandler(){
    AppState.logger.debug("Note open / change event.")
    editing_note.value = $viewState.editing_note
    has_open_note.value = editing_note.value != null
}
function windowCloseRequestHandler(close_success_callback?: () => void, close_cancel_callback?: () => void){
    AppState.logger.debug("Window close request event.")
    closing_note.value = true
    closing_note_success_callback.value = close_success_callback ?? (() => {})
    closing_note_cancel_callback.value = close_cancel_callback ?? (() => {})
}
$emitter.on(EventConstant.NOTE_OPENED, openedNoteChangeHandler)
$emitter.on(EventConstant.NOTE_CLOSED, openedNoteChangeHandler)
$emitter.on(EventConstant.WINDOW_CLOSED_REQUEST, windowCloseRequestHandler)

// # init page: check if there is any opened note for this window
onMounted(async () => {
    try {
        if ($viewState.editing_note != null){
            // already opened a note (probably from go back in this page from another page)
            editing_note.value = $viewState.editing_note
            has_open_note.value = true
        } else {
            // cannot use await without onMounted 
            // (i.e. cannot use await before the component instance is created)
            has_open_note.value = await NoteFileHandler.openInitNoteForThisWindow()
            AppState.logger.debug(`Has open note: ${has_open_note.value}`)
        }
    } catch (error) {
        AppState.logger.error(`Error when init page: ${error}`)
        has_open_note.value = false
        no_error.value = false
        exceptionHandler(error, "error.general.open_note")
        $emitter.once(EventConstant.ERROR_MODAL_CLOSED, () => {
            no_error.value = true
        })
    }
    loading.value = false
})

// # listen to the file drop event
const unlisten_drop_file = await appWindow.onFileDropEvent(async (event) => {
    AppState.logger.debug(`Got event in window ${event.windowLabel}, payload: ${event.payload}`)
    try {
        if (event.payload.type != "drop"){
            return
        }
        let selected_open_path = NoteFileHandler.getPathFromSelectedFiles(event.payload.paths)
        AppState.logger.debug(`Selected open path: ${selected_open_path}`)
        await NoteFileHandler.openNote(null, selected_open_path)
    } catch (error) {
        no_error.value = false
        exceptionHandler(error, "error.general.open_note")
        $emitter.once(EventConstant.ERROR_MODAL_CLOSED, () => {
            no_error.value = true
        })
    }
})

// # listen to close window request event
const unlisten_close_window = await appWindow.onCloseRequested(async (event) => {
    AppState.logger.info("Close window request.")
    event.preventDefault()

    let close_window_fn = async () => {
        // close Logger
        await AppState.logger.close()
        appWindow.close()
    }

    if (editing_note.value != null){
        // with opened note, ask to save
        await NoteFileHandler.closeNote(close_window_fn)
    } else {
        // no opened note, just close
        close_window_fn()
    }
})

onBeforeUnmount(() => {
    $emitter.off(EventConstant.NOTE_OPENED, openedNoteChangeHandler)
    $emitter.off(EventConstant.NOTE_CLOSED, openedNoteChangeHandler)
    $emitter.off(EventConstant.WINDOW_CLOSED_REQUEST, windowCloseRequestHandler)
    unlisten_drop_file()
    unlisten_close_window()
    invoke("remove_opened_file", { windowId: $viewState.window_id })
})

</script>

<template>
    <div>
        <Spin size="large" fix :show="loading" class="mt-loading-init-page-spin"></Spin>
    
        <!-- For creating / opening a note -->
        <!-- !loading && no_error => won't show two Modal (this + error Modal) at once which cause scroll bug -->
        <mt-home-init-note v-if="!loading && no_error && !has_open_note" />

        <mt-home-close-note 
            v-if="closing_note" 
            v-model:enabled="closing_note"
            :close_success_callback="closing_note_success_callback"
            :close_cancel_callback="closing_note_cancel_callback"
        />

        <!-- After a note is opened -->
        <div v-if="has_open_note">
            <!-- Loading the note-->
            <div v-if="editing_note == null" class="mt-open-note-spin-container">
                <Spin fix>
                    <Icon type="ios-loading" size=18></Icon>
                    <div>{{ tran("common.loading") }}</div>
                </Spin>
            </div>
            <mt-note v-else :note="editing_note" />
        </div>
    </div>
</template>

<style scoped>
.mt-loading-init-page-spin {
    z-index: 1400;
}

.mt-open-note-spin-container {
    display: inline-block;
    width: 100%;
    height: 87vh;
    position: relative;
}
</style>