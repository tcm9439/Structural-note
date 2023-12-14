<script setup lang="ts">
import { EventConstant } from "structural-core"
import { Icon } from "view-ui-plus"
import { NoteFileHandler, NoteExportHandler } from "@/composables/file/NoteFileHandler"
import { appWindow } from "@tauri-apps/api/window"
const { $viewState, $emitter, $Modal } = useNuxtApp()

const editing_note_name = ref<string>($viewState.editing_note_name)
const has_open_note = computed(() => $viewState.editing_note != null)

// # menu
const refresh_menu = ref(0)

async function menuSelectHandler(menu_item: string){
    try {
        switch (menu_item){
            case "open-file":
                // without await, the catch block will not work
                await NoteFileHandler.openNote(appWindow.label, !has_open_note.value)
                break
            case "save-file":
                if (has_open_note.value) {
                    await NoteFileHandler.saveNote()
                }
                break
            case "save-as-file":
                if (has_open_note.value) {
                    await NoteFileHandler.saveNote(true)
                }
                break
            case "export-md":
                if (has_open_note.value){
                    await NoteExportHandler.exportToMarkdown()
                }
                break
        }
    } catch (error) {
        $Modal.error({
            title: "Fail to handle operation",
            content: `${error}`
        })
    }
    refresh_menu.value++
}

// # listen to open note event (from here or the menu)
function openNoteHandler(){
    editing_note_name.value = $viewState.editing_note_name
}
$emitter.on(EventConstant.NOTE_OPENED, openNoteHandler);
onBeforeUnmount(() => {
    $emitter.off(EventConstant.NOTE_OPENED, openNoteHandler);
})
</script>

<template>
    <Header>
        <Row>
            <Col>
                <span class="note-name">
                    {{editing_note_name}}
                </span>
            </Col>
            <Col>
                <Menu mode="horizontal" theme="dark" :key="refresh_menu"
                    @on-select="menuSelectHandler"
                >
                    <Submenu name="file-operation">
                        <template #title>
                            <Icon type="md-folder" />
                            File
                        </template>
                        <!-- <MenuItem name="close-file">Close (TODO)</MenuItem> -->
                        <MenuItem name="open-file">Open</MenuItem>
                        <MenuItem name="save-file">Save</MenuItem>
                        <MenuItem name="save-as-file">Save As</MenuItem>
                        <MenuGroup title="Export">
                            <MenuItem name="export-md">
                                Export to Markdown
                            </MenuItem>
                            <MenuItem name="export-txt">
                                Export to Text (TODO)
                            </MenuItem>
                        </MenuGroup>
                    </Submenu>
                    <MenuItem name="setting">
                        <Icon type="md-settings" />
                        Setting
                    </MenuItem>
                </Menu>
            </Col>
        </Row>
    </Header>
</template>

<style scoped>
.ivu-layout-header {
    position: fixed;
    width: 100%;
    z-index: 20;
    max-height: max(8vh, 40px);
    line-height: max(8vh, 40px);
}

.ivu-menu-horizontal {
    max-height: max(8vh, 40px);
    line-height: max(8vh, 40px);
}

.ivu-menu-item {
    padding: 0 10px;
}

.ivu-menu-submenu {
    padding: 0 10px;
}

.note-name {
    color: #fff;
    padding-right: 10px;
}
</style>