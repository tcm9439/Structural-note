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
const attr_name = ref(attr_value.definition.name)
const full_width_form_item = ref(false)
const attr_description = ref(attr_value.definition.description)

const is_required_attr = computed(() => {
    return !attr_value.definition.isOptionalAttr()
})

const container_div_class = computed(() => {
    let class_var = "attr-wrapper"
    if (full_width_form_item.value){
        class_var += " full-width-attr"
    }
    return class_var
})

watch(() => props.render, () => {
    attr_value = activeDataGetter(editing_note, props.edit_path) as AttributeValue<any>
    attr_name.value = attr_value.definition.name
    attr_description.value = attr_value.definition.description
    console.log("description changed in base", attr_description.value)
})
</script>

<template>
    <div :class="container_div_class">
        <mt-attribute-value-form-label 
            :label="attr_name" :required="is_required_attr"
            :description="attr_description"
            />
        <FormItem 
            :prop="attr_id" 
            :error="attr_value.validate_result.invalid_message" >
            <mt-attribute-value-editor 
                :type="props.type" 
                v-model:value="attr_value.value" 
                v-model:full_width="full_width_form_item"
            />
        </FormItem>
    </div>
</template>

<style scoped>
    textarea {
        resize: none;
    }

    .attr-wrapper {
        display: inline-block;
        margin: 5px;
        padding-right: 10px;
    }

    .attr-wrapper.full-width-attr{
        width: 100%;
    }

    .ivu-form-item {
        margin-bottom: 12px;
        width: 100%;
    }
</style>