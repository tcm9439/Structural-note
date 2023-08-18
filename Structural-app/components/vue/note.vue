<script setup lang="ts">
import { Note, StructuralSection } from "structural-core"

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
            <template v-if="(value instanceof StructuralSection)">
                <vue-section-structural-section :section="value" />
            </template>
            <template v-else>
                <vue-section-note-section :section="value" />
            </template>
        </template>
    </Card>    
</template>