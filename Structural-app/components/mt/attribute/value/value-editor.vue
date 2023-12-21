<script setup lang="ts">
import { IntegerAttribute, DecimalAttribute, StringAttribute, BooleanAttribute, MarkdownAttribute } from "structural-core"

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

if (props.type === MarkdownAttribute.TYPE){
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
    <template v-else-if="props.type === StringAttribute.TYPE">
        <Input v-model="value"/>
    </template>
    <template v-else-if="props.type === BooleanAttribute.TYPE">
        <Switch v-model="value" />
    </template>
    <template v-else-if="props.type === MarkdownAttribute.TYPE">
        <mt-editor-markdown v-model:content="value" />
    </template>
</template>