<script setup lang="ts">
import { EditPath, Note, AttributeValue } from "structural-core"

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject("editing-note"))
const value = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as AttributeValue<string>)

</script>

<template>
    <span>{{ value.definition.name }}: </span>
    <Input 
        v-model="value.value" 
        style="width: 300px"
    />
</template>

<style>
    textarea {
        resize: none;
    }
</style>