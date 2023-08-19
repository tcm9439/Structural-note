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
        
        <template v-for="(value, index) of props.note.sections.ordered_components" :key="value.id">
            <Form>
                <template v-if="(value instanceof StructuralSection)">
                    <vue-section-structural :section="value" />
                </template>
                <template v-else>
                    <vue-section-base :section="value" />
                </template>
            </Form>
        </template>
    </Card>    
</template>