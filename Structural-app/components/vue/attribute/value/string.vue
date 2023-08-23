<script setup lang="ts">
import { AttributeValue } from "structural-core"

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject("editing-note"))
const edit_path = props.edit_path
const value = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as AttributeValue<string>)

</script>

<template>
    <Input v-model="value.value"></Input>
</template>