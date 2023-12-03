<!-- 
    Section for opening an existing note file or creating a new one.
 -->

<script setup lang="ts">
import { Icon } from "view-ui-plus"
import { appWindow } from "@tauri-apps/api/window"
import { NoteFileHandler } from "@/composables/file/NoteFileHandler"

// # error prompt
const show_error_modal = ref(false)
const error_content = ref("")

// # open note button
const opening_note = ref(false)
async function openNote(){
    opening_note.value = true
    try {
        await NoteFileHandler.openNote(appWindow.label, true)
    } catch (error) {
        error_content.value = `Fail to open note: ${error}`
        show_error_modal.value = true
    }
    opening_note.value = false
}

// # create note
const create_note_mode = ref<boolean>(false)
const new_note_title = ref<string>("untitled")
function toggleCreateNoteMode(value: boolean){
    create_note_mode.value = value
}

function createNote(){
    try {
        if (create_note_mode.value){
            NoteFileHandler.createNote(new_note_title.value)
        }
    } catch (error) {
        error_content.value = `Fail to create note: ${error}`
        show_error_modal.value = true
    }
}
</script>

<template>
    <Modal 
        :model-value="true"
        :closable="false"
        :mask-closable="false"
    >
        <div v-if="create_note_mode">
            <!-- Creating note -->
            Filename: <Input v-model="new_note_title" />
        </div> 
        <div v-else>
            <!-- Chose to create / open -->
            <Space direction="vertical" style="width: 100%;">
                <Button long type="primary" 
                    @click="toggleCreateNoteMode(true)">
                    New Note
                </Button>
                <Button long type="primary"
                    @click="openNote" :loading="opening_note">
                    Open existing note
                </Button>
            </Space>
        </div>

        <!-- Error prompt -->
        <Modal 
            :modelValue="show_error_modal"
            :closable="false"
            :mask-closable="false"
            class-name="vertical-center-modal"
        >
            <template #header>
                <Icon type="md-alert" color="red" />
                Error
            </template>
            {{error_content}}

            <template #footer>
                <Button type="primary" @click="show_error_modal = false">
                    Confirm
                </Button>
            </template>
        </Modal>

        <!-- Cancel / create button depending on the current state -->
        <template #footer>
            <div v-if="create_note_mode">
                <Button @click="toggleCreateNoteMode(false)">
                    Cancel
                </Button>
                <Button @click="createNote" type="primary">
                    Create
                </Button>
            </div>
            <div v-else>
                <Button @click="createNote">
                    Cancel
                </Button>
            </div>
        </template>
    </Modal>
</template>