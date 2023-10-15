<script setup lang="ts">
import { EditPath, Note, InjectConstant, AttributeDefinition, MaxConstrain } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const constrain = activeDataGetter(editing_note, props.edit_path) as MaxConstrain<any>
const constrain_type = props.attr_def.attribute_type?.type || ""
</script>

<template>
    <FormItem label="Max Value" prop="max">
        <mt-attribute-value-editor :type="constrain_type" v-model:value="constrain.max" />
    </FormItem>
</template>
