<script setup lang="ts">
import { EditPath, Note, StructuralSection } from "structural-core"

const props = defineProps<{
    note: Note,
}>()

// Provide the note in edit to the children
const editing_note = ref(props.note)
provide("editing-note", props.note)

// The children will use this path to get the node from the editing note
const edit_path = new EditPath()

const getSections = computed(() => {
    return editing_note.value.stepInEachChildren(edit_path).map((child_path) => {
        const child_id = child_path.getLastStep()
        const child = child_path.getNodeByPath(editing_note.value)
        let child_type: string
        if (child instanceof StructuralSection){
            child_type = "StructuralSection"
        } else {
            child_type = "NoteSection"
        }
        return {
            id: child_id,
            type: child_type,
            path: child_path,
        }
    })
})

</script>

<template>
    <Card>
        <template #title>
            {{ editing_note.title }}
        </template>
        
        <div style="background-color: lightgray;">
            <!-- debug area -->
            {{ editing_note }}
        </div>

        <template v-for="section of getSections">
            <template v-if="section.type == 'StructuralSection'">
                <vue-section-structural :edit_path="section.path" />
            </template>
            <template v-else>
                <vue-section-base :edit_path="section.path"/>
            </template>
        </template>
    </Card>    
</template>