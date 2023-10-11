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

// reload the values in this element
function getElementsValues(){
    return elementListGetter(editing_note, struct_element, props.edit_path, attrValueComponentMapper)
}
const elements_values = shallowRef(getElementsValues())

// on structural section definition change
function attributeDefinitionUpdateHandler(edit_queue: StructEditQueue){
    StructDefEditEventElementHandler.editQueueConsumer(struct_element, edit_queue)
    // reload the elements & DOM
    elements_values.value = getElementsValues()
}
$emitter.on(EventConstant.ATTR_DEF_UPDATE, attributeDefinitionUpdateHandler);

onBeforeUnmount(() => {
    // Unsubscribe or remove event listeners here. Otherwise, the DOM could not be destroyed
    $emitter.off(EventConstant.ATTR_DEF_UPDATE, attributeDefinitionUpdateHandler);
})

</script>

<template>
    <!-- One form per element so that form-item can use attr id as prop (key) -->
    <div style="border: 1px solid #a8a8a8; padding: 10px;">
        <Form inline label-position="top">
            <template v-for="value in elements_values" :key="value.id">
                <component :is='value.type' :edit_path="value.path" />
            </template>
        </Form>
    </div>
</template>