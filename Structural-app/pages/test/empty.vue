<script setup lang="ts">
import { Note } from "structural-core"

let test_note: Ref<Note> = ref(new Note("My empty note")) as Ref<Note>
</script>

<template>
    <mt-note :note="test_note" v-if="test_note !== null"/>
</template>