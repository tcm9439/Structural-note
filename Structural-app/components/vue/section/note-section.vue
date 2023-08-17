<script setup lang="ts">
import { NoteSection } from 'structural-core';

const props = defineProps<{
    section: NoteSection,
}>()

</script>

<template>
    <Card>
        <template #title>
            {{ props.section.title }}
        </template>
    
        <template v-for="(value, index) of props.section.elements.orderedComponents" :key="value.id">
            <vue-element-text-element :text="value" />
        </template>
    </Card>
</template>