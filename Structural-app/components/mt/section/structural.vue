<script setup lang="ts">
import { EditPath, StructuralSection, Note, InjectConstant } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Note | undefined = inject(InjectConstant.EDITING_NOTE)
const section = activeDataGetter(editing_note, props.edit_path) as StructuralSection
let def_path: EditPath
try {
    def_path = section.stepInEachChildren(props.edit_path, StructuralSection.DEFINITION_FILTER_MODE)[0]
} catch (error) {
    console.error("Cannot get the definition path.", error)
}

const edit_def_mode = ref(false)
function startEditDef(){
    // show the edit-struct-def component
    edit_def_mode.value = true
}

</script>

<template>
    <mt-section-base :edit_path="edit_path" class="no-pad">
        <template #operation>
            <Button type="primary" @click="startEditDef">Edit Def</Button>
        </template>
    </mt-section-base>

    <!-- Show the edit def window once user click the Edit button -->
    <mt-attribute-definition-edit-struct-def 
        v-if="edit_def_mode"
        :edit_path="def_path" 
        v-model:edit_def_mode="edit_def_mode"
    />
</template>

<style>
.no-pad {
    padding: 0;
}
</style>