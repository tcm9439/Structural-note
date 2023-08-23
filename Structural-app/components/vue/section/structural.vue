<script setup lang="ts">
import { EditPath, StructuralSection } from 'structural-core';

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject("editing-note"))
const edit_path = props.edit_path
// const section = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as StructuralSection)

</script>

<template>
    <vue-section-base :edit_path="edit_path">
        <template #operations>
            <Button type="primary">TODO</Button>
        </template>
    </vue-section-base>
</template>