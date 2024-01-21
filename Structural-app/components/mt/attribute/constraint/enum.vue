<script setup lang="ts">
import { EditPath, AttributeDefinition, EnumConstraint } from "@structural-note/structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath | null, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
    enable: boolean,
}>()

const constraint = activeDataGetter(props.attr_def, props.edit_path) as EnumConstraint
const available_values = ref([...constraint.getAvailableValuesMap().entries()]) as Ref<[number, string][]>
console.log(available_values.value)

function onCreateEnumItem(value: string) {
    constraint.addAvailableValue(value)
    available_values.value = [...constraint.getAvailableValuesMap().entries()]
}

function onDeleteEnumItem(index: number){
    constraint.removeAvailableValue(index)
    available_values.value = [...constraint.getAvailableValuesMap().entries()]
}
</script>

<template>
    <mt-editor-tag-definition-list
        :tags="available_values"
        @create="onCreateEnumItem"
        @delete="onDeleteEnumItem"
    />
</template>
