<!-- 
    Constrain that has no parameters, just a checkbox to enable/disable it.
 -->
<script setup lang="ts">
import { EditPath, Constraint, AttributeDefinition } from "@structural-note/structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath | null, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
    enable: boolean,
}>()

const emit = defineEmits<{
    (event: 'initNoParamConstraint', enable: boolean): void
}>()

const constraint = activeDataGetter(props.attr_def, props.edit_path) as Constraint

// init the constraint enable checkbox
emit("initNoParamConstraint", constraint !== null)
</script>

<template>
</template>
