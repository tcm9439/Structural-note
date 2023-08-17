<script setup lang="ts">
import { Note } from "structural-core"

const props = defineProps<{
    note: Note,
}>()

</script>

<template>
    <h1>{{ props.note.title }}</h1>
    <template  v-for="(value, index) of props.note.sections.components" :key="value[0]">
        <vue-section-text-section :text_section="value[1]" />
    </template>
</template>