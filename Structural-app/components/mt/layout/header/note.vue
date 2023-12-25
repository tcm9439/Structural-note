<script setup lang="ts">
import { AppState, EventConstant, AppPage, AppPageUtil } from "structural-core"
import { Icon } from "view-ui-plus"
import { NoteFileHandler, NoteExportHandler } from "@/composables/file/NoteFileHandler"
import { appWindow } from "@tauri-apps/api/window"
import { tran } from "@/composables/app/translate"
import { exceptionHandler } from "@/composables/app/exception"

const { $viewState, $emitter } = useNuxtApp()

const editing_note_name = ref<string>($viewState.editing_note_name)
const has_open_note = computed(() => $viewState.editing_note != null)

// # menu
const refresh_menu = ref(0)

async function saveNoteBeforeUpdateSetting(){
    const { $Modal } = useNuxtApp()

    // ask to save file
    // choice: 1. save and go to setting 2. give up operation
    await $Modal.confirm({
        title: tran("common.save_confirm_window.title", null, {
            target: tran("structural.file.note")
        }),
        content: tran("structural.setting.save_before.content"),
        okText: tran("common.save_confirm_window.save"),
        onOk: async () => {
            try {
                await NoteFileHandler.saveNote()
                AppState.logger.debug(`Note saved before setting update.`)
                let setting_page_route = AppPageUtil.getPageRoute(AppPage.SETTING)
                AppState.logger.debug(`Navigate to setting page: ${setting_page_route}`)
                await navigateTo(setting_page_route)
            } catch (error) {
                exceptionHandler(error)
            }
        },
        cancelText: tran("common.cancel"),
    })
}

async function menuSelectHandler(menu_item: string){
    try {
        switch (menu_item){
            case "open-file":
                // without await, the catch block will not work
                await NoteFileHandler.openNote(appWindow.label, !has_open_note.value)
                break
            case "close-file":
                if (has_open_note.value) {
                    await NoteFileHandler.closeNote()
                }
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
            case "setting":
                if (has_open_note.value){
                    await saveNoteBeforeUpdateSetting()
                }
                break
        }
    } catch (error) {
        exceptionHandler(error)
    }
    refresh_menu.value++
}

// # listen to open / close note event (from here or the menu)
function openedNoteChangeHandler(){
    editing_note_name.value = $viewState.editing_note_name
}

$emitter.on(EventConstant.NOTE_OPENED, openedNoteChangeHandler)
$emitter.on(EventConstant.NOTE_CLOSED, openedNoteChangeHandler)
onBeforeUnmount(() => {
    $emitter.off(EventConstant.NOTE_OPENED, openedNoteChangeHandler)
    $emitter.off(EventConstant.NOTE_CLOSED, openedNoteChangeHandler)
})
</script>

<template>
    <mt-layout-header-base>
        <Row>
            <Col class="mt-layout-note-title">
                {{ editing_note_name }}
            </Col>
        </Row>
        <Row class="mt-layout-toolbar" :key="refresh_menu">
            <Col class="mt-layout-toolbar">
                <Menu 
                    mode="horizontal" 
                    @on-select="menuSelectHandler"
                >
                    <Submenu name="file-operation">
                        <template #title>
                            <Icon type="md-folder" />
                            {{ tran("structural.header.file_menu") }}
                        </template>
                        <MenuItem name="open-file">
                            {{ tran("structural.header.file_open") }}
                        </MenuItem>
                        <MenuItem name="close-file">
                            {{ tran("structural.header.file_close") }}
                        </MenuItem>
                        <MenuItem name="save-file">
                            {{ tran("structural.header.file_save") }}
                        </MenuItem>
                        <MenuItem name="save-as-file">
                            {{ tran("structural.header.file_save_as") }}
                        </MenuItem>
                        <MenuGroup :title="tran('structural.header.file_export_submenu')">
                            <MenuItem name="export-md">
                                {{ tran("structural.header.file_export_md") }}
                            </MenuItem>
                            <MenuItem name="export-txt">
                                {{ tran("structural.header.file_export_txt") }}
                            </MenuItem>
                        </MenuGroup>
                    </Submenu>
                    <MenuItem name="setting">
                        <Icon type="md-settings" />
                        {{ tran("structural.header.setting_menu") }}
                    </MenuItem>
                </Menu>
            </Col>
        </Row>
    </mt-layout-header-base>
    <div class="mt-layout-toolbar-padding"></div>
</template>

<style scoped>
.mt-layout-note-title {
    color: rgba(255,255,255,.7);
    max-height: max(6vh, 30px);
    line-height: max(6vh, 30px);
    padding-left: 20px;
    /* bold */
    font-weight: 600;
    font-size: larger;
}

.mt-layout-toolbar-padding {
    height: max(6vh, 30px);
}

.mt-layout-toolbar {
    background-color: white;
}

.mt-layout-toolbar .ivu-menu-horizontal {
    height: max(6vh, 30px);
    line-height: max(6vh, 30px);
    width: 100%;
}
</style>