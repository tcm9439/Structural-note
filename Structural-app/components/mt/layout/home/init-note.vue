<!-- 
    Section for opening an existing note file or creating a new one.
 -->

<script setup lang="ts">
import { appWindow } from "@tauri-apps/api/window"
import { NoteFileHandler } from "@/composables/handler/NoteFileHandler"
import { tran } from "@/composables/app/translate"
import { AppState } from "structural-core"
import { exceptionHandler } from "@/composables/app/exception"

// # open note button
const opening_note = ref(false)
async function openNote(){
    opening_note.value = true
    try {
        await NoteFileHandler.openNote(appWindow.label, true)
    } catch (error) {
        exceptionHandler(error, "error.general.open_note")
    }
    opening_note.value = false
}

// # create note
const create_note_mode = ref<boolean>(false)
const new_note_title = ref<string>(tran("structural.file.untitled"))
function toggleCreateNoteMode(value: boolean){
    create_note_mode.value = value
}

function createNote(){
    try {
        if (new_note_title.value == ""){
            AppState.logger.debug("Creating note using default title.")
            NoteFileHandler.createNote(tran("structural.file.untitled"))
        } else {
            AppState.logger.debug(`Creating note: ${new_note_title.value}`)
            NoteFileHandler.createNote(new_note_title.value)
        }
    } catch (error) {
        exceptionHandler(error, "error.general.create_note")
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
            {{ tran("structural.file.filename") }}<span style="color: red">*</span> 
            <Input v-model="new_note_title" />
        </div> 
        <div v-else>
            <!-- Chose to create / open -->
            <Space direction="vertical" style="width: 100%;">
                <Button long type="primary" 
                    @click="toggleCreateNoteMode(true)">
                    {{ tran("structural.file.create_note") }}
                </Button>
                <Button long type="primary"
                    @click="openNote" :loading="opening_note">
                    {{ tran("structural.file.open_existing_note") }}
                </Button>
            </Space>
        </div>

        <!-- Cancel / create button depending on the current state -->
        <template #footer>
            <div v-if="create_note_mode">
                <Button @click="toggleCreateNoteMode(false)">
                    {{ tran("common.cancel") }}
                </Button>
                <Button @click="createNote" type="primary">
                    {{ tran("common.create") }}
                </Button>
            </div>
            <div v-else>
                <Button @click="createNote">
                    {{ tran("common.cancel") }}
                </Button>
            </div>
        </template>
    </Modal>
</template>~/composables/handler/NoteFileHandler