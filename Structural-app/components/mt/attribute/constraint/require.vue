<script setup lang="ts">
import { EditPath, RequireConstraint, AttributeDefinition } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
    enable: boolean,
}>()

const emit = defineEmits<{
    (event: 'existMeansTrueConstraintUpdate', enable: boolean): void
}>()

const constraint = activeDataGetter(props.attr_def, props.edit_path) as RequireConstrain

// init the constraint enable checkbox
emit("existMeansTrueConstraintUpdate", constraint.required)

watch(() => props.enable, (new_val) => {
    constraint.required = new_val
    emit("existMeansTrueConstraintUpdate", new_val)
})
</script>

<template>
</template>
