<script setup lang="ts">
import { EditPath, Note, StructuralSection } from 'structural-core';

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> = ref(inject("editing-note")) as Ref<Note>
const section: Ref<StructuralSection> = ref(props.edit_path.getNodeByPath(editing_note.value)) as Ref<StructuralSection>

const edit_def_mode = ref(false)
const def_path = section.value.stepInEachChildren(props.edit_path, StructuralSection.DEFINITION_FILTER_MODE)[0]

function startEditDef(){
    edit_def_mode.value = true
}

</script>

<template>
    <mt-section-base :edit_path="edit_path" class="no-pad">
        <template #operation>
            <Button type="primary" @click="startEditDef">Edit Def</Button>
        </template>
    </mt-section-base>

    <mt-attribute-definition-edit-struct-def 
        :edit_path="def_path" 
        v-model:edit_def_mode="edit_def_mode"/>
</template>

<style>
.no-pad {
    padding: 0;
}
</style>