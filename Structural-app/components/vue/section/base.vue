<script setup lang="ts">
import { Note, NoteSection, TextElement, StructuralElement, EditPath } from 'structural-core'

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject("editing-note"))
const edit_path = props.edit_path
const section = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as NoteSection)

const getElement = computed(() => {
    return section?.value.stepInEachChildren(edit_path).map((child_path) => {
        const child_id = child_path.getLastStep()
        const child = child_path.getNodeByPath(editing_note.value)
        let child_type: string
        if (child instanceof StructuralElement){
            child_type = "StructuralElement"
        } else if (child instanceof TextElement){
            child_type = "TextElement"
        } else {
            child_type = ""
        }
        return {
            id: child_id,
            type: child_type,
            path: child_path,
        }
    })
})

function changeNote(event){
    let ele2 = new TextElement("======> Yeah <======")
    section.value.elements.add(ele2)
}

</script>

<template>
    <Card v-if="section != null">
        <template #title>
            {{ section.title }}
        </template>

        <slot name="operations"></slot>

        <button @click="changeNote">[Debug] Add example element</button>
    
        <template v-for="element of getElement" :key="element.id">
            <template v-if="element.type === 'TextElement'">
                <vue-element-text :edit_path="element.path" />
            </template>
            <template v-else-if="element.type === 'StructuralElement'">
                <vue-element-structural :edit_path="element.path" />
            </template>
        </template>
    </Card>
</template>