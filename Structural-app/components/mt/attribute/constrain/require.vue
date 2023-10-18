<script setup lang="ts">
import { EditPath, Note, InjectConstant, RequireConstrain, AttributeDefinition } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath, // edit_path to the Constrain
    attr_def: AttributeDefinition<any>,
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const constrain = activeDataGetter(editing_note, props.edit_path) as RequireConstrain
</script>

<template>
    <FormItem prop="required">
        <Switch v-model="constrain.required" />
    </FormItem>
</template>
