<!-- 
    Home page of the app. 
    - Initial value: any opened note (passed from another window)?
        - If no note is opened, show a modal for creating / opening a note
        - If a note is opened, show the note
 -->

<script setup lang="ts">
import { Note, EventConstant, Logger } from "structural-core"
import { NoteFileHandler } from "@/composables/file/NoteFileHandler"
const { $emitter, $viewState, $Modal } = useNuxtApp()
import { appWindow } from "@tauri-apps/api/window"
import { invoke } from "@tauri-apps/api/tauri"
import { Icon } from "view-ui-plus"

const editing_note = ref<Note|null>(null)
const has_open_note = ref<boolean>(false)

// # listen to the note opened event (from here or the menu)
function noteOpenedHandler(){
    Logger.get().debug("Note opened event.")
    editing_note.value = $viewState.editing_note
    has_open_note.value = true
    Logger.get().debug("Note opened.")
}
$emitter.on(EventConstant.NOTE_OPENED, noteOpenedHandler)

// # init page: check if there is any opened note for this window
const window_id = appWindow.label
try {
    has_open_note.value = await NoteFileHandler.openInitNoteForThisWindow(window_id)
    console.log(`Has open note: ${has_open_note.value}`)
} catch (error) {
    $Modal.error({
        title: "Fail to open note",
        content: `${error}`
    })
}

// # listen to the file drop event
const unlisten_drop_file = await appWindow.onFileDropEvent(async (event) => {
    console.log(`Got event in window ${event.windowLabel}, payload: ${event.payload}`)
    try {
        if (event.payload.type != "drop"){
            return
        }
        let selected_open_path = NoteFileHandler.getPathFromSelectedFiles(event.payload.paths)
        console.log(`Selected open path: ${selected_open_path}`)
        await NoteFileHandler.openNote(window_id, !has_open_note.value, selected_open_path)
    } catch (error) {
        $Modal.error({
            title: "Fail to open note",
            content: `${error}`
        })
    }
})

// # listen to close window request event
const unlisten_close_window = await appWindow.onCloseRequested(async (event) => {
    Logger.get().info("Close window request.")
    if (editing_note.value != null){
        // TODO ask to save note
        // const confirmed = await confirm('Are you sure?');
        // if (!confirmed) {
        //     // user did not confirm closing the window; let's prevent it
        //     event.preventDefault();
        // }
        // await NoteFileHandler.saveNote()
    }
    // close Logger
    await Logger.get().close()
})

onBeforeUnmount(() => {
    $emitter.off(EventConstant.NOTE_OPENED, noteOpenedHandler)
    unlisten_drop_file()
    unlisten_close_window()
    invoke("remove_opened_file", { windowId: window_id })
})

</script>

<template>
    <!-- For creating / opening a note -->
    <mt-home-init-note v-if="!has_open_note" />

    <!-- After a note is opened -->
    <div v-if="has_open_note">
        <!-- Loading the note-->
        <div v-if="editing_note == null" class="spin-container">
            <Spin fix>
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
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