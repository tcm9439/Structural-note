<script setup lang="ts">
import { EditPath, Note, AttributeValue, InjectConstant } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath,
    type: string,
    render: number,
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
let attr_value = activeDataGetter(editing_note, props.edit_path) as AttributeValue<any>
const attr_id = attr_value.definition.id

watch(() => props.render, () => {
    attr_value = activeDataGetter(editing_note, props.edit_path) as AttributeValue<any>
})
</script>

<template>
    <FormItem :label="attr_value.definition.name" :prop="attr_id" :error="attr_value.validate_result.invalid_message">
        <mt-attribute-value-editor :type="props.type" v-model:value="attr_value.value" />
    </FormItem>
</template>

<style scoped>
    textarea {
        resize: none;
    }
</style>