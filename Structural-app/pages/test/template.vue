<script setup lang="ts">
import { Note, AppPage, EventConstant } from "structural-core"
import { tran } from "~/composables/app/translate"
import { NoteFileHandler } from "~/composables/handler/NoteFileHandler"
import { NOTE_TEMPLATES } from "@/composables/assets-helper/template-helper"

const { $viewState, $emitter } = useNuxtApp()
$viewState.last_page = AppPage.TEST_TEMPLATE
$emitter.emit(EventConstant.LAYOUT_UPDATE, AppPage.TEST_TEMPLATE)

const template_id = ref("tutorial")
let test_note: Ref<Note | null> = ref(null)

watch(template_id, (new_id) => {
    test_note.value = NoteFileHandler.createNoteFromTemplate(tran("structural.template.template"), template_id.value)
    $viewState.setOpenNote(test_note.value)
}, { immediate: true })
</script>

<template>
    <Card style="margin-bottom: 20px;">
        <template #title>
            <div>
                {{ tran("structural.template.select_template") }}
            </div>
        </template>
        <div style="margin: 10px 0px;">
            This section is for demo purpose only and will not appear in the app.
        </div>
        <Select v-model="template_id" style="width:200px">
            <Option v-for="template in NOTE_TEMPLATES" :value="template.id" :key="template.id">
                {{ template.label.toDisplayText() }}
            </Option>
        </Select>
    </Card>
    <mt-note :note="test_note" v-if="test_note !== null"/>
</template>