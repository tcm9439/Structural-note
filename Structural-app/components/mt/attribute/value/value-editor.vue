<script setup lang="ts">
import { IntegerAttribute, DecimalAttribute, ShortStringAttribute, LongStringAttribute, BooleanAttribute, MarkdownAttribute } from "structural-core"

const props = defineProps<{
    value: any,
    type: string,
    full_width?: boolean,
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
    LongStringAttribute.TYPE, MarkdownAttribute.TYPE
]
if (full_width_form_item_list.includes(props.type)){
    full_width.value = true
}

</script>

<template>
    <template v-if="props.type === IntegerAttribute.TYPE">
        <InputNumber v-model="value" controls-outside 
            :active-change="false"
            :precision="0" :step="1"
        />
    </template>
    <template v-else-if="props.type === DecimalAttribute.TYPE">
        <InputNumber v-model="value" :step="0.1" 
            controls-outside 
            :active-change="false"
        />
    </template>
    <template v-else-if="props.type === ShortStringAttribute.TYPE">
        <Input v-model="value"/>
    </template>
    <template v-else-if="props.type === LongStringAttribute.TYPE">
        <div class="mt-full-width-attr">
            <Input type="textarea" :autosize="{ minRows: 1 }" v-model="value"/> 
        </div>
    </template>
    <template v-else-if="props.type === BooleanAttribute.TYPE">
        <Switch v-model="value" />
    </template>
    <template v-else-if="props.type === MarkdownAttribute.TYPE">
        <div class="mt-full-width-attr">
            <mt-editor-markdown v-model:content="value" />
        </div>
    </template>
</template>

<style scoped>
.mt-full-width-attr {
    width: 100%;
}
</style>