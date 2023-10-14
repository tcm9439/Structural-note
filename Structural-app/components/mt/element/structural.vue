<script setup lang="ts">
import { EditPath, StructuralElement, StructEditQueue, EventConstant,StructDefEditEventElementHandler, InjectConstant, Note } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { elementListGetter } from "@/composables/active-data/ElementListGetter"
import { attrValueComponentMapper } from "@/composables/active-data/AttrValueComponentMapper"
const { $emitter } = useNuxtApp()

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureElement
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const struct_element = activeDataGetter(editing_note, props.edit_path) as StructuralElement
const collapse_open_panel = ref(struct_element.id)

// reload the values in this element
function getElementsValues(){
    return elementListGetter(editing_note, struct_element, props.edit_path, attrValueComponentMapper)
}
const elements_values = shallowRef(getElementsValues())

// on structural section definition change
const render_value_components = ref(0)
function attributeDefinitionUpdateHandler(edit_queue: StructEditQueue){
    // All elements' attributeDefinitionUpdateHandler share the same edit_queue so it must be clone() before consume
    StructDefEditEventElementHandler.editQueueConsumer(struct_element, edit_queue.clone())
    // reload the elements & DOM
    elements_values.value = getElementsValues()
    render_value_components.value++
}
$emitter.on(EventConstant.ATTR_DEF_UPDATE, attributeDefinitionUpdateHandler);

onBeforeUnmount(() => {
    // Unsubscribe or remove event listeners here. Otherwise, the DOM could not be destroyed
    $emitter.off(EventConstant.ATTR_DEF_UPDATE, attributeDefinitionUpdateHandler);
})

</script>

<template>
    <Collapse v-model="collapse_open_panel">
        <Panel :name="struct_element.id">
            <template #content>
                <!-- One form per element so that form-item can use attr id as prop (key) -->
                <Form inline label-position="top">
                    <template v-for="value in elements_values" :key="value.id">
                        <mt-attribute-value-base :edit_path="value.path" :type="value.type" :render="render_value_components"/>
                    </template>
                </Form>
            </template>
        </Panel>
    </Collapse>
</template>