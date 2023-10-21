<script setup lang="ts">
import { Note, EventConstant } from "structural-core"
import { NoteFileHandler } from "@/composables/file/NoteFileHandler"
import { Icon } from "view-ui-plus"
const { $emitter, $viewState } = useNuxtApp()

const editing_note = ref<Note|null>(null)
const editing_note_name = computed(() => editing_note.value?.title ?? "")

// # open note
const opening_note = ref(false)
const has_open_note = computed(() => editing_note.value !== null)
async function openNote(){
    opening_note.value = true
    await NoteFileHandler.openNote()
    opening_note.value = false
}

// # error modal
const show_error_modal = ref(false)
const error_content = ref("")

// # create note
const create_note_mode = ref<boolean>(false)
const new_note_title = ref<string>("untitled")
function toggleCreateNoteMode(value: boolean){
    create_note_mode.value = value
}

function createNote(){
    if (new_note_title.value.trim() === ""){
        show_error_modal.value = true
        error_content.value = "Filename cannot be empty"
        return
    }
    editing_note.value = new Note(new_note_title.value)
    console.log("Created note with title", editing_note.value.title)
    $viewState.editing_note = editing_note.value

    // finish create note
    create_note_mode.value = false
    $emitter.emit(EventConstant.OPEN_NOTE);
}

// # listen to open note event (from here or the menu)
function openNoteHandler(){
    editing_note.value = $viewState.editing_note
}
$emitter.on(EventConstant.OPEN_NOTE, openNoteHandler);
onBeforeUnmount(() => {
    $emitter.off(EventConstant.OPEN_NOTE, openNoteHandler);
})
</script>

<template>
    <!-- For creating / opening a note -->
    <Modal 
        :modelValue="!has_open_note"
        :closable="false"
        :mask-closable="false"
    >
        <div v-if="!create_note_mode">
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
        <div v-else>
            Filename: <Input v-model="new_note_title" />
        </div>

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
            {{ error_content }}

            <template #footer>
                <Button type="primary" @click="show_error_modal = false">
                    Confirm
                </Button>
            </template>
        </Modal>
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

    <!-- After a note is opened -->
    <mt-note v-if="has_open_note" :note="editing_note" />
</template>