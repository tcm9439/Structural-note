<script setup lang="ts">
import { EditPath, AttributeDefinition, MaxConstraint } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
    enable: boolean,
}>()

const constraint = activeDataGetter(props.attr_def, props.edit_path) as MaxConstraint<any>
const constraint_type = props.attr_def.attribute_type?.type || ""
</script>

<template>
    <FormItem prop="max">
        <mt-attribute-value-editor :type="constraint_type" v-model:value="constraint.max" />
    </FormItem>
</template>
