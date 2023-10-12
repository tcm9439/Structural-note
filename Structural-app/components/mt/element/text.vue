<script setup lang="ts">
import { TextElement, EditPath, InjectConstant, Note } from "structural-core"
import { activeDataGetter } from '@/composables/active-data/ActiveDataGetter'

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const element = shallowReactive(activeDataGetter(editing_note, props.edit_path) as TextElement)
console.log("render text element", element)
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