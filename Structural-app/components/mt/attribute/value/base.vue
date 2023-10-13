<script setup lang="ts">
import { EditPath, Note, AttributeValue, InjectConstant } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"

const props = defineProps<{
    edit_path: EditPath,
    type: string,
}>()

const editing_note = inject(InjectConstant.EDITING_NOTE) as Note
const attr_value = activeDataGetter(editing_note, props.edit_path) as AttributeValue<number>
const attr_id = attr_value.definition.id
const attr_name = attr_value.definition.name
const attr_value_value = ref(attr_value.value)
const invalid_message = ref(attr_value.validate_result.invalid_message)
</script>

<template>
    <FormItem :label="attr_name" :prop="attr_id" :error="invalid_message">
        <template v-if="props.type === 'NUMBER'">
            <InputNumber v-model="attr_value_value" controls-outside />
        </template>
        <template v-else-if="props.type === 'STRING'">
            <Input v-model="attr_value_value" style="width: 300px"/>
        </template>
    </FormItem>
</template>

<style>
    textarea {
        resize: none;
    }
</style>