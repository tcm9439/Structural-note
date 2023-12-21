<script setup lang="ts">
import { EditPath, StructuralSection, Note, InjectConstant, ElementType, StructuralElement } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { type AvailableSection } from "@/composables/active-data/Note"
import { Icon } from "view-ui-plus"

const props = defineProps<{
    edit_path: EditPath,
    available_section_types: AvailableSection[],
}>()

const editing_note: Note | undefined = inject(InjectConstant.EDITING_NOTE)
const section = activeDataGetter(editing_note, props.edit_path) as StructuralSection

const no_definition = computed(() => section.definition.attributes.length() == 0)
const render_available_element = ref(0)

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

watch(edit_def_mode, () => {
    render_available_element.value += 1
})

</script>

<template>
    <mt-section-base 
        :edit_path="edit_path" 
        :available_section_types="available_section_types"
        :render_available_element="render_available_element"
        @add-element="addElement"
        class="no-pad">

        <!-- Edit definition button -->
        <template #operation>
            <Button 
                type="primary" class="section-operation-button-gp"
                @click="startEditDef">
                <Icon type="md-options" />
            </Button>
        </template>

        <template #body>
            <div v-if="no_definition" class="mt-add-definition-container">
                <Button shape="circle" icon="md-add" long 
                    class="mt-add-definition-button" type="primary"
                    @click="startEditDef"
                >
                    Add Definition
                </Button>
            </div>
        </template>
    </mt-section-base>

    <!-- Show the edit def window once user click the Edit button -->
    <mt-attribute-definition-edit-struct-def 
        v-if="edit_def_mode"
        :edit_path="def_path"
        :struct_section="section"
        v-model:edit_def_mode="edit_def_mode"
    />
</template>

<style scoped>
.no-pad {
    padding: 0;
}

.mt-add-definition-container {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
}

.mt-add-definition-button {
    width: 80%;
}
</style>