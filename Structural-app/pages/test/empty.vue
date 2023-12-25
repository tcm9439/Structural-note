<script setup lang="ts">
import { Note, AppPage, EventConstant } from "structural-core"
const { $viewState, $emitter } = useNuxtApp()
$viewState.last_page = AppPage.TEST
$emitter.emit(EventConstant.LAYOUT_UPDATE, AppPage.TEST)

let test_note: Ref<Note> = ref(new Note("My empty note")) as Ref<Note>
</script>

<template>
    <mt-note :note="test_note" v-if="test_note !== null"/>
</template>