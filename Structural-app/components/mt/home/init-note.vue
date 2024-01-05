<!-- 
    Section for opening an existing note file or creating a new one.
 -->

<script setup lang="ts">
import { NoteFileHandler } from "@/composables/handler/NoteFileHandler"
import { tran } from "@/composables/app/translate"
import { AppState } from "structural-core"
import { exceptionHandler } from "@/composables/app/exception"

// # open note button
const opening_note = ref(false)
async function openNote(){
    opening_note.value = true
    try {
        await NoteFileHandler.openNote()
    } catch (error) {
        exceptionHandler(error, "error.general.open_note")
    }
    opening_note.value = false
}

// # create note
const create_note_mode = ref<boolean>(false)
const create_note_from_template = ref<string>("blank")
const new_note_title = ref<string>(tran("structural.file.untitled"))
function toggleCreateNoteMode(value: boolean){
    create_note_mode.value = value
}
function onSelectTemplate(template_id: string){
    create_note_from_template.value = template_id
}

function createNote(){
    try {
        AppState.logger.debug(`Creating note: ${new_note_title.value ?? "default title"}`)
        NoteFileHandler.createNote(new_note_title.value, create_note_from_template.value)
    } catch (error) {
        exceptionHandler(error, "error.general.create_note")
    }
}
</script>

<template>
    <Modal 
        :styles="{top: '40px'}"
        :model-value="true"
        :closable="false"
        :mask-closable="false"
        width="85"
    >
        <div class="mt-init-note-modal">
            <div v-if="create_note_mode">
                <!-- Creating note -->
                {{ tran("structural.file.filename") }}<span style="color: red">*</span> 
                <Input v-model="new_note_title" />

                <mt-home-note-template @select="onSelectTemplate"/>
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
</template>
