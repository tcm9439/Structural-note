<script setup lang="ts">
import { Note, TextElement, EditPath, InjectConstant } from 'structural-core'

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject(InjectConstant.EDITING_NOTE))
const element = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as TextElement)

</script>

<template>
    <Input 
        type="textarea" :autosize="{ minRows: 2 }"
        v-model="element.content"
    /> 
</template>

<style>
    /* Don't allow user to drag & alter size of the input box */
    textarea {
        resize: none;
    }
</style>