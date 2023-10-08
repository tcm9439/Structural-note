<script setup lang="ts">
import { EditPath, Note, AttributeValue, InjectConstant } from "structural-core"
import { FormItem } from "view-ui-plus";

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Ref<Note> | undefined = ref(inject(InjectConstant.EDITING_NOTE))
const value = editing_note === undefined? null : ref(props.edit_path.getNodeByPath(editing_note.value) as AttributeValue<number>)
const attr_name = value?.value.definition.name
const attr_id = value?.value.definition.id

</script>

<template>
    <FormItem :label="attr_name" :prop="attr_id" :error="value.validate_result.invalid_message">
        <InputNumber v-model="value.value" controls-outside />
    </FormItem>
</template>
