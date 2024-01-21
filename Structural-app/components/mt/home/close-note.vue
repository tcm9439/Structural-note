<script setup lang="ts">
import { AppState } from "@structural-note/structural-core"
import { tran } from '~/composables/app/translate'
import { NoteFileHandler } from '~/composables/handler/NoteFileHandler'

const props = defineProps<{
    enabled: boolean,
    close_success_callback: () => void,
    close_cancel_callback:  () => void,
}>()

const emit = defineEmits<{
    (event: 'update:enabled', value: boolean): void
}>()

const title = tran("common.save_confirm_window.title", null, {target: tran("structural.file.note")})
async function onSave(){
    // button for closing with saving
    AppState.logger.debug("Saving note before closing window...")
    await NoteFileHandler.saveNote()
    props.close_success_callback()
    emit("update:enabled", false)
}
function onCancel(){
    // button for canceling the close operation
    AppState.logger.debug("Cancel closing window.")
    props.close_cancel_callback()
    emit("update:enabled", false)
}

function onDoNotSave(){
    AppState.logger.debug("Close without saving.")
    props.close_success_callback()
    emit("update:enabled", false)
}
</script>

<template>
    <Modal 
        :styles="{top: '40px'}"
        :model-value="true"
        :closable="false"
        :mask-closable="false"
        :title="title"
    >

        <div>
            {{ tran("common.save_confirm_window.content") }}
        </div>

        <!-- Cancel / create button depending on the current state -->
        <template #footer>
            <Button @click="onCancel" >
                {{ tran("common.cancel") }}
            </Button>
            <Button @click="onSave" type="primary">
                {{ tran("common.save_confirm_window.save") }}
            </Button>
            <Button @click="onDoNotSave" type="error">
                {{ tran("common.save_confirm_window.do_not_save") }}
            </Button>
        </template>
    </Modal>
</template>