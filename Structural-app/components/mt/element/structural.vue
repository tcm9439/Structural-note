<script setup lang="ts">
import { StructuralElement } from "structural-core"

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject("editing-note"))
const edit_path = props.edit_path
const struct_element = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as StructuralElement)

const getValues = computed(() => {
    return struct_element?.value.stepInEachChildren(edit_path).map((child_path) => {
        const child_id = child_path.getLastStep()
        const child = child_path.getNodeByPath(editing_note.value)

        return {
            id: child_id,
            type: child.definition_type_str,
            path: child_path,
        }
    })
})

</script>

<template>
    <template v-for="value in getValues">
        <template v-if="value.type === 'STRING'">
            <mt-attribute-value-string :edit_path="value.path"></mt-attribute-value-string>
        </template> 
    </template>
</template>