<script setup lang="ts">
import { NoteSection, TextElement, StructuralElement } from 'structural-core';

const props = defineProps<{
    section: NoteSection,
}>()

</script>

<template>
    <Card>
        <template #title>
            {{ props.section.title }}
        </template>

        <slot name="operations"></slot>
    
        <template v-for="(value, index) of props.section.elements.orderedComponents" :key="value.id">
            <template v-if="(value instanceof TextElement)">
                <vue-element-text-element :text="value" />
            </template>
            <template v-else-if="(value instanceof StructuralElement)">
                <div>TODO</div>
            </template>
        </template>
    </Card>
</template>