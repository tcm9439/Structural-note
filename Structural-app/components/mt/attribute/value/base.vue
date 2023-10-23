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

const set_value_checkbox = computed(() => {
    return attr_value.definition.isOptionalAttr()
})
const value_is_set_for_optional_attr = computed({
    get: () => attr_value.is_set,
    set: (is_set) => {
        if (is_set){
            attr_value.value = attr_value.definition.default_value_for_attr
        } else {
            attr_value.unsetValue()
        }
    }
})
const div_background_color_class = computed(() => set_value_checkbox.value? "attr-wrapper optional-attr" : "attr-wrapper compulsory-attr")

watch(() => props.render, () => {
    attr_value = activeDataGetter(editing_note, props.edit_path) as AttributeValue<any>
})
</script>

<template>
    <div :class="div_background_color_class">
        <div class="optional-checkbox">
            <FormItem v-if="set_value_checkbox" :prop="attr_id + '_checkbox'" >
                <Checkbox v-model="value_is_set_for_optional_attr" />
            </FormItem>
        </div>
        <FormItem 
        :label="attr_value.definition.name" :prop="attr_id" :error="attr_value.validate_result.invalid_message">
        <mt-attribute-value-editor :type="props.type" v-model:value="attr_value.value" />
        </FormItem>
    </div>
</template>

<style scoped>
    textarea {
        resize: none;
    }

    .optional-attr {
        background-color: whitesmoke;
        padding: 10px;
    }

    .attr-wrapper {
        display: inline-block;
        margin: 5px;
    }

    .attr-wrapper.compulsory-attr:has(.full-width-attr), .attr-wrapper.compulsory-attr:has(.full-width-attr) *:not(.full-width-attr){
        width: 100%;
    }

    /* Optional attr need space for the checkbox */
    .attr-wrapper.optional-attr:has(.full-width-attr), .attr-wrapper.optional-attr:has(.full-width-attr) *:not(.full-width-attr){
        width: calc(100% - 35px);
    }

    .optional-checkbox {
        display: inline-block;
        margin-right: 5px;
        max-width: 20px;
    }

    .ivu-form-item {
        margin-bottom: 12px;
    }
</style>