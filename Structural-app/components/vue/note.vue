<script setup lang="ts">
import { Note } from "structural-core"

const props = defineProps<{
    note: Note,
}>()

</script>

<template>
    <Card>
        <template #title>
            {{ props.note.title }}
        </template>
    
        <template  v-for="(value, index) of props.note.sections.orderedComponents" :key="value.id">
        <vue-section-note-section :section="value" />
    </template>
    </Card>    
</template>