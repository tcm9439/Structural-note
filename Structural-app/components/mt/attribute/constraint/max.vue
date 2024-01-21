<script setup lang="ts">
import { EditPath, AttributeDefinition, MaxConstraint } from "@structural-note/structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { tran } from "~/composables/app/translate"

const props = defineProps<{
    edit_path: EditPath | null, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
    enable: boolean,
}>()

const constraint = activeDataGetter(props.attr_def, props.edit_path) as MaxConstraint<any>
const constraint_type = props.attr_def.attribute_type?.type || ""
</script>

<template>
    <FormItem prop="max" :label-width="20">
        <mt-attribute-value-editor :type="constraint_type" v-model:value="constraint.max" />
    </FormItem>
    <div class="mt-inclusive-label">{{ tran("structural.attribute.constraint.param.inclusive_label") }}</div>
</template>

<style scoped>
.mt-inclusive-label {
    margin-left: 16px;
    margin-top: -32px;
}
</style>
