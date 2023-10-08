<script setup lang="ts">
import { EditPath, Note, StructuralElement, StructEditQueue, InjectConstant, EventConstant, EndOfEditPathError, AttributeValue, StructDefEditEventElementHandler } from "structural-core"
import MtAttributeValueString from "@/components/mt/attribute/value/string.vue"
import MtAttributeValueNumber from "@/components/mt/attribute/value/number.vue"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureElement
}>()
const { $emitter } = useNuxtApp()

const editing_note: Note | undefined = inject(InjectConstant.EDITING_NOTE)
const struct_element = editing_note === undefined? null : props.edit_path.getNodeByPath(editing_note) as StructuralElement

type ElementValue = {
    id: string,
    type: any, // DefineComponent
    path: EditPath,
}

function getElementsValues(): ElementValue[]{
    return struct_element?.stepInEachChildren(props.edit_path).reduce((result, child_path) => {
        const child_id = child_path.getLastStep()
        let child = null
        try {
            child = child_path.getNodeByPath(editing_note) as unknown as AttributeValue<any>
        } catch (error) {
            if (error instanceof EndOfEditPathError){
                // TODO the attr may not have value yet if just added
                child = null
            }
        }

        if (child === null){
            return result
        }

        // map the AttributeValue type 
        let child_type: any // DefineComponent
        switch(child.definition_type_str){
            case "STRING":
                child_type = MtAttributeValueString
                break
            case "NUMBER":
                child_type = MtAttributeValueNumber
                break
        }

        result.push({
            id: child_id,
            type: child_type,
            path: child_path,
        })
        return result
    }, [] as ElementValue[]) ?? []
}

// reload the values in this element
const elements_values: Ref<null | ElementValue[]> = shallowRef(null)
const reload_elements = ref(0)
watch(reload_elements, () => {
    elements_values.value = getElementsValues()
}, { immediate: true })

// alter the DOM according to the changes
function attributeDefinitionUpdateHandler(edit_queue: StructEditQueue){
    console.log("attributeDefinitionUpdateHandler")
    StructDefEditEventElementHandler.editQueueConsumer(struct_element, edit_queue)
    reload_elements.value += 1
}
$emitter.on(EventConstant.ATTR_DEF_UPDATE, attributeDefinitionUpdateHandler);

onBeforeUnmount(() => {
    // Unsubscribe or remove event listeners here. Otherwise, the DOM could not be destroyed
    $emitter.off(EventConstant.ATTR_DEF_UPDATE, attributeDefinitionUpdateHandler);
})

</script>

<template>
    <!-- One form per element so that form-item can use attr id as prop (key) -->
    <Form inline label-position="top">
        <template v-for="value in elements_values" :key="value.id">
            <component :is='value.type' :edit_path="value.path" />
        </template>
    </Form>
</template>