<script setup lang="ts">
import { EditPath, StructuralSection } from 'structural-core';

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject("editing-note"))
const edit_path = props.edit_path
// const section = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as StructuralSection)

const mode = ref(1)

function createDef(){
    console.log("createDef")
    mode.value = 2
}

function editDef(){
    console.log("editDef")
}

</script>

<template>
    <mt-section-base :edit_path="edit_path" class="no-pad">
        <template #operation>
            <template v-if="mode === 1">
                <Button type="primary" @click="createDef">Create Def</Button>
            </template>
            <template v-else>
                <Button type="primary" @click="editDef">Edit Def</Button>
            </template>
        </template>
    </mt-section-base>
</template>

<style>
.no-pad {
    padding: 0;
}
</style>