<script setup lang="ts">
import { Icon } from "view-ui-plus"
import { open, save } from "@tauri-apps/api/dialog"
import { Note, EventConstant} from "structural-core"
import { NoteFileHandler } from "@/composables/file/NoteFileHandler"
const { $viewState, $emitter } = useNuxtApp();

const struct_note_file_extension = "structnote"
const editing_note = ref<Note | null>(null)
let save_path: string | null = null

function menuSelectHandler(menu_item: string){
    console.log("menu select", menu_item)
    switch (menu_item){
        case "open-file":
            console.log("open file")
            openNote()
            break
        case "save-file":
            console.log("save file")
            saveNote()
            break
        case "save-as-file":
            saveNote(true)
            break
    }
}

async function saveNote(save_as_mode: boolean = false){
    try {
        let this_save_path = save_path
        if (save_path === null || save_as_mode){
            // there is no save path set,
            // ask the user to chose a save path
            const default_note_filename = $viewState.editing_note.title + "." + struct_note_file_extension
            this_save_path = await save({
                title: "Save",
                filters: [
                    { name: "Note", extensions: [ struct_note_file_extension ] },
                ],
                defaultPath: default_note_filename
            })
        }
        if (this_save_path === null){
            console.warn("No path is chosen to save.")
        } else {
            await NoteFileHandler.saveAsFile($viewState.editing_note, this_save_path)
        }

        if (!save_as_mode){
            save_path = this_save_path
        }
    } catch (err) {
        console.error(err);
    }
}

async function openNote(){
    try {
        const selected_open_path = await open({
            title: "Open",
            multiple: false,
            directory: false,
            filters: [
                { name: "Note", extensions: [ struct_note_file_extension ] },
            ]
        })

        if (selected_open_path === null){
            console.warn("No path is chosen to open.")
            return
        } 

        // check if the selected open path is a String[]
        if (Array.isArray(selected_open_path)){
            console.warn("The selected open path is an array, which is not expected.")
            return
        }

        // selected_open_path === String
        editing_note.value = await NoteFileHandler.loadFile(selected_open_path)

        // set default save path as the open path
        save_path = selected_open_path
        $viewState.editing_note = editing_note.value

        // emit the open note event
        $emitter.emit(EventConstant.OPEN_NOTE)
    } catch (err) {
        console.error(err);
    }
}
</script>

<template>
    <Menu mode="horizontal" theme="dark" @on-select="menuSelectHandler">
        <MenuItem name="title">
            {{ editing_note?.title || ""}}
        </MenuItem>
        <Submenu name="file-operation">
            <template #title>
                <Icon type="ios-stats" />
                File
            </template>
            <MenuItem name="open-file">Open</MenuItem>
            <MenuItem name="save-file">Save</MenuItem>
            <MenuItem name="save-as-file">Save As</MenuItem>
        </Submenu>
        <MenuItem name="setting">
            <Icon type="md-settings" />
            Setting
        </MenuItem>
    </Menu>
</template>

<style scoped>
    .ivu-menu-horizontal {
        position: fixed;
        width: 100%;
        z-index: 20;
        max-height: max(8vh, 40px);
        line-height: max(8vh, 40px);
    }
    
    .white-text {
        padding-right: 10px;
        color: #fff;
    }
</style>