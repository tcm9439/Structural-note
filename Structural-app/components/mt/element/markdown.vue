<script setup lang="ts">
import { MarkdownElement, EditPath, InjectConstant, Note } from "@structural-note/structural-core"
import { activeDataGetter } from '@/composables/active-data/ActiveDataGetter'

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const element = shallowReactive(activeDataGetter(editing_note, props.edit_path) as MarkdownElement)
</script>

<template>
    <mt-editor-markdown v-model:content="element.content"/>
</template>
