<script setup lang="ts">
import { EditPath, Note, StructuralElement } from "structural-core"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the StructureElement
}>()

const editing_note: Ref<Note> | undefined = ref(inject("editing-note"))
const struct_element = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as StructuralElement)

type ElementValue = {
    id: string,
    type: string,
    path: EditPath,
}

function getElementsValues(): ElementValue[]{
    return struct_element?.value.stepInEachChildren(props.edit_path).map((child_path) => {
        const child_id = child_path.getLastStep()
        let child = null
        try {
            // TODO the attr may not have value yet if just added
            child = child_path.getNodeByPath(editing_note.value)
        } catch (error) {
            
        }

        return {
            id: child_id,
            type: child?.definition_type_str,
            path: child_path,
        }
    }) ?? []
}

// const getValues = computed(() => {
//     console.log("struct element edit_path", props.edit_path)
//     return getElementsValues()
// })

const elements_values: Ref<null | ElementValue[]> = ref(null)
// watch the length of the struct_element.value.values => update elements_values
watch(() => struct_element?.value?.values.size, () => {
    elements_values.value = getElementsValues()
}, { immediate: true })

</script>

<template>
    <template v-for="value in elements_values">
    <!-- <template v-for="value in getValues"> -->
        <template v-if="value.type === 'STRING'">
            <mt-attribute-value-string :edit_path="value.path"></mt-attribute-value-string>
        </template> 
    </template>
</template>