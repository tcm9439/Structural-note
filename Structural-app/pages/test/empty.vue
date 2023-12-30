<script setup lang="ts">
import { Note, AppPage, EventConstant } from "structural-core"
const { $viewState, $emitter } = useNuxtApp()
$viewState.last_page = AppPage.TEST_EMPTY
$emitter.emit(EventConstant.LAYOUT_UPDATE, AppPage.TEST_EMPTY)

let test_note: Ref<Note> = ref(new Note("My empty note")) as Ref<Note>
$viewState.setOpenNote(test_note.value)
</script>

<template>
    <mt-note :note="test_note" v-if="test_note !== null"/>
</template>