<script setup lang="ts">
import { EditPath, MinConstraint, AttributeDefinition } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
    enable: boolean,
}>()

const constraint = activeDataGetter(props.attr_def, props.edit_path) as MinConstraint<any>
const constraint_type = props.attr_def.attribute_type?.type || ""
</script>

<template>
    <FormItem prop="min">
        <mt-attribute-value-editor :type="constraint_type" v-model:value="constraint.min" />
    </FormItem>
</template>
