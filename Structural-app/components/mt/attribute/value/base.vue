<script setup lang="ts">
import { EditPath, Note, AttributeValue, InjectConstant } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath,
    type: string,
    render: number,
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
let attr_value = ref(activeDataGetter(editing_note, props.edit_path) as AttributeValue<any>)
const attr_id = attr_value.value.definition.id

watch(() => props.render, () => {
    attr_value.value = activeDataGetter(editing_note, props.edit_path) as AttributeValue<any>
})
</script>

<template>
    <FormItem :label="attr_value.definition.name" :prop="attr_id" :error="attr_value.validate_result.invalid_message">
        <template v-if="props.type === 'INT'">
            <InputNumber v-model="attr_value.value" :step="1" controls-outside />
        </template>
        <template v-else-if="props.type === 'DECIMAL'">
            <InputNumber v-model="attr_value.value" :step="0.1" controls-outside />
        </template>
        <template v-else-if="props.type === 'STRING'">
            <Input v-model="attr_value.value"/>
        </template>
        <template v-else-if="props.type === 'BOOLEAN'">
            <Switch v-model="attr_value.value" />
        </template>
    </FormItem>
</template>

<style scoped>
    textarea {
        resize: none;
    }
</style>