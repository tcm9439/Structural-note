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
    
        <template v-for="(value, index) of props.section.elements.ordered_components" :key="value.id">
            <template v-if="(value instanceof TextElement)">
                <vue-element-text :text="value" />
            </template>
            <template v-else-if="(value instanceof StructuralElement)">
                <vue-element-structural :struct_element="value" />
            </template>
        </template>
    </Card>
</template>