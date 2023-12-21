<script setup lang="ts">
import { EditPath, RequireConstrain, AttributeDefinition } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
    enable: boolean,
}>()

const constrain = activeDataGetter(props.attr_def, props.edit_path) as RequireConstrain

watch(() => props.enable, (new_val) => {
    constrain.required = new_val
})
</script>

<template>
</template>
