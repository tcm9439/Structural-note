<script setup lang="ts">
import { EditPath, Note, StructuralSection, ViewState } from "structural-core"
import MtSectionBase from "@/components/mt/section/base.vue"
import MtSectionStructural from "@/components/mt/section/structural.vue"

const props = defineProps<{
    note: Note,
}>()

// Provide the note in edit to the children
const editing_note = ref(props.note)
provide("editing-note", props.note)

const { $viewState } = useNuxtApp()
const view_state = ref($viewState)

view_state.value.editing_note_name = props.note.title

// The children will use this path to get the node from the editing note
const edit_path = new EditPath()

const getSections = computed(() => {
    return editing_note.value.stepInEachChildren(edit_path).map((child_path) => {
        const child_id = child_path.getLastStep()
        const child = child_path.getNodeByPath(editing_note.value)
        let child_type
        if (child instanceof StructuralSection){
            child_type = MtSectionStructural
        } else {
            child_type = MtSectionBase
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
            <p>{{ editing_note.title }}</p>
        </template>
        
        <!-- <div style="background-color: lightgray;">
            {{ editing_note }}
        </div> -->

        <template v-for="section of getSections">
            <component :is="section.type" :edit_path="section.path" />
        </template>
        
    </Card>    
</template>