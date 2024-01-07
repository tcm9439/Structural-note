<script setup lang="ts">
import { AttributeTypeEnum, AttributeDefinition, ConstraintType, EnumConstraint } from "structural-core"

const props = defineProps<{
    value: any,
    type: string,
    full_width?: boolean,
    attr_def?: AttributeDefinition<any>,
}>()

// v-modal value & full_width
const value = computed({
    get: () => props.value,
    set: (v) => emit('update:value', v)
})

const full_width = computed({
    get: () => props.full_width,
    set: (v) => emit('update:full_width', v)
})

const emit = defineEmits<{
    (event: 'update:value', value: any): void
    (event: 'update:full_width', full_width: boolean): void
}>()

const full_width_form_item_list = [
    AttributeTypeEnum.LONG_STRING, AttributeTypeEnum.MARKDOWN
]
if (full_width_form_item_list.includes(props.type as AttributeTypeEnum)){
    full_width.value = true
}

function getEnumAvailableValues(): [number, string][] {
    if (!props.attr_def){
        return []
    }
    let enum_constraint = props.attr_def.getConstraint(ConstraintType.ENUM) as EnumConstraint
    return [...enum_constraint.getAvailableValuesMap().entries()]
}
</script>

<template>
    <template v-if="props.type === AttributeTypeEnum.INT">
        <InputNumber v-model="value" controls-outside 
            :active-change="false"
            :precision="0" :step="1"
        />
    </template>
    <template v-else-if="props.type === AttributeTypeEnum.DECIMAL">
        <InputNumber v-model="value" :step="0.1" 
            controls-outside 
            :active-change="false"
        />
    </template>
    <template v-else-if="props.type === AttributeTypeEnum.STRING">
        <Input v-model="value"/>
    </template>
    <template v-else-if="props.type === AttributeTypeEnum.LONG_STRING">
        <div class="mt-full-width-attr">
            <Input type="textarea" :autosize="{ minRows: 1 }" v-model="value"/> 
        </div>
    </template>
    <template v-else-if="props.type === AttributeTypeEnum.BOOLEAN">
        <Switch v-model="value" />
    </template>
    <template v-else-if="props.type === AttributeTypeEnum.MARKDOWN">
        <div class="mt-full-width-attr">
            <mt-editor-markdown v-model:content="value" />
        </div>
    </template>
    <template v-else-if="props.type === AttributeTypeEnum.ENUM">
        <Select v-model="value">
            <Option v-for="item in getEnumAvailableValues()" :value="item[0]" :key="item[0]">
                {{ item[1] }}
            </Option>
        </Select>
    </template>
</template>

<style scoped>
.mt-full-width-attr {
    width: 100%;
}
</style>