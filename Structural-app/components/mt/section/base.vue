<script setup lang="ts">
import { Note, NoteSection, TextElement, StructuralElement, EditPath, InjectConstant } from 'structural-core'

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject(InjectConstant.EDITING_NOTE))
const edit_path = props.edit_path
const section = editing_note === undefined? null : reactive(props.edit_path.getNodeByPath(editing_note.value) as NoteSection)

const getElement = computed(() => {
    return section?.stepInEachChildren(edit_path).map((child_path) => {
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

</script>

<template>
    <Card v-if="section != null">
        <template #title>
            <Input v-model="section.title" :border="false" />
        </template>

        <template #extra>
            <slot name="operation"></slot>
        </template>
        
        <slot name="content"></slot>
    
        <template v-for="element of getElement" :key="element.id">
            <template v-if="element.type === 'TextElement'">
                <mt-element-text :edit_path="element.path" />
            </template>
            <template v-else-if="element.type === 'StructuralElement'">
                <mt-element-structural :edit_path="element.path" />
            </template>
        </template>
    </Card>
</template>