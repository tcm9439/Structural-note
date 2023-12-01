<!-- 
    Home page of the app. 
    - Initial value: any opened note (passed from another window)?
        - If no note is opened, show a modal for creating / opening a note
        - If a note is opened, show the note
 -->

<script setup lang="ts">
import { Note, EventConstant } from "structural-core"
import { NoteFileHandler } from "@/composables/file/NoteFileHandler"
const { $emitter, $viewState } = useNuxtApp()
import { appWindow } from "@tauri-apps/api/window"
import { invoke } from "@tauri-apps/api/tauri"
import { WindowUtil } from "@/composables/app/window"
import { Icon } from "view-ui-plus"

const editing_note = ref<Note|null>(null)
const has_open_note = ref<boolean>(false)

// # init page: check if there is any opened note for this window
const window_id = appWindow.label
let note_path: string = await invoke("get_opened_note_for_window", { windowId: window_id })
console.log(`Init window... Note path: ${note_path}`)
if (note_path != ""){
    console.log("Has opened note.")
    has_open_note.value = true
    NoteFileHandler.openNote(window_id, note_path)
} else {
    console.log("No opened note.")
    has_open_note.value = false
}

// # listen to the note opened event (from here or the menu)
function noteOpenedHandler(){
    editing_note.value = $viewState.editing_note
    has_open_note.value = true
    // loading_note.value = true
    console.log("Note opened.", editing_note.value)
}
$emitter.on(EventConstant.NOTE_OPENED, noteOpenedHandler)

// # listen to the file drop event
const unlisten_drop_file = await appWindow.onFileDropEvent(async (event) => {
    console.log(`Got event in window ${event.windowLabel}, payload: ${event.payload}`)
    if (event.payload.type !== 'drop') {
        return
    }
    if (window_id !== event.windowLabel){
        console.log("Not event for this window. Skip.")
        return
    }

    let selected_open_path = NoteFileHandler.getPathFromSelectedFiles(event.payload.paths)
    console.log(`Selected open path: ${selected_open_path}`)

    let already_open: boolean = await invoke("is_file_already_open", { filepath: selected_open_path })
    if (already_open){
        console.error("Fail to add opened file.")
    } else {
        if (editing_note.value == null){
            // open in this window
            has_open_note.value = true
            NoteFileHandler.openNote(window_id, selected_open_path)
        } else {
            console.log("create new window..")
            let new_window_id = WindowUtil.generateNewWindowId()
            await invoke("try_open_file", { windowId: new_window_id, filepath: selected_open_path })
            WindowUtil.createNewWindow(new_window_id)
        }
    }
})

// const unlisten_drop_file = await listen(TauriEvent.WINDOW_FILE_DROP, async (event) => {
//     console.log(`Got event in window ${event.windowLabel}, payload: ${event.payload}`)
//     if (window_id !== event.windowLabel){
//         console.log("Not event for this window. Skip.")
//         return
//     }

//     let selected_open_path = NoteFileHandler.getPathFromSelectedFiles(event.payload)
//     console.log(`Selected open path: ${selected_open_path}`)

//     let already_open: boolean = await invoke("is_file_already_open", { filepath: selected_open_path })
//     if (already_open){
//         console.error("Fail to add opened file.")
//     } else {
//         console.log("create new window..")
//         let new_window_id = WindowUtil.generateNewWindowId()
//         await invoke("try_open_file", { windowId: new_window_id, filepath: selected_open_path })
//         WindowUtil.createNewWindow(new_window_id)
//     }
// })

onBeforeUnmount(() => {
    $emitter.off(EventConstant.NOTE_OPENED, noteOpenedHandler)
    unlisten_drop_file()
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