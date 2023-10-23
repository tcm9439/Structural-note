<script setup lang="ts">
import { EditPath, RequireConstrain, AttributeDefinition } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
}>()

const constrain = activeDataGetter(props.attr_def, props.edit_path) as RequireConstrain
</script>

<template>
    <FormItem prop="required">
        <Switch v-model="constrain.required" />
    </FormItem>
</template>
