<script setup lang="ts">
import { Note, EventConstant } from "structural-core"
const { $emitter, $viewState } = useNuxtApp();

const open_note = ref<Note|null>(null)
function openNoteSection(){
    open_note.value = $viewState.editing_note
}

$emitter.on(EventConstant.OPEN_NOTE, openNoteSection);
onBeforeUnmount(() => {
    $emitter.off(EventConstant.OPEN_NOTE, openNoteSection);
})
</script>

<template>
    <mt-note :note="open_note" v-if="open_note !== null"/>
</template>