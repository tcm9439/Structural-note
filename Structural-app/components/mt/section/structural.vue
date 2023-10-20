<script setup lang="ts">
import { EditPath, StructuralSection, Note, InjectConstant, ElementType, StructuralElement } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { AvailableSection } from "@/composables/active-data/Note"

const props = defineProps<{
    edit_path: EditPath,
    available_section_types: AvailableSection[],
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

function addElement(element_type: ElementType, last_element_id?: string){   
    let new_element
    switch(element_type){
        case ElementType.STRUCT:
            new_element = new StructuralElement(section.definition)
            break
        default:
            return
    }
    section.elements.addAfter(new_element, last_element_id)
}

</script>

<template>
    <mt-section-base 
        :edit_path="edit_path" 
        :available_section_types="available_section_types"
        @add-element="addElement"
        class="no-pad">
        <template #operation>
            <Button 
                type="primary" class="section-operation-button"
                @click="startEditDef">
                Edit Def
            </Button>
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