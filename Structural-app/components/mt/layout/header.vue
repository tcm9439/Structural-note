<script setup lang="ts">
import { EventConstant } from "structural-core"
import { Icon } from "view-ui-plus"
import { NoteFileHandler } from "@/composables/file/NoteFileHandler"
const { $viewState, $emitter } = useNuxtApp();

const editing_note_name = ref<string>($viewState.editing_note_name)

function menuSelectHandler(menu_item: string){
    console.log("menu select", menu_item)
    switch (menu_item){
        case "open-file":
            console.log("open file")
            NoteFileHandler.openNote()
            break
        case "save-file":
            console.log("save file")
            NoteFileHandler.saveNote()
            break
        case "save-as-file":
            NoteFileHandler.saveNote(true)
            break
    }
}

// # listen to open note event (from here or the menu)
function openNoteHandler(){
    editing_note_name.value = $viewState.editing_note_name
}
$emitter.on(EventConstant.OPEN_NOTE, openNoteHandler);
onBeforeUnmount(() => {
    $emitter.off(EventConstant.OPEN_NOTE, openNoteHandler);
})
</script>

<template>
    <Menu mode="horizontal" theme="dark" @on-select="menuSelectHandler">
        <MenuItem name="title">
            {{ editing_note_name }}
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