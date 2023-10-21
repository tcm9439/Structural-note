<script setup lang="ts">
import { IntegerAttribute, DecimalAttribute, StringAttribute, BooleanAttribute, MarkdownAttribute } from "structural-core"

const props = defineProps<{
    value: any,
    type: string,
}>()

// v-modal value
const value = computed({
    get: () => props.value,
    set: (v) => emit('update:value', v)
})

const emit = defineEmits<{
    (event: 'update:value', value: any): void
}>()

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