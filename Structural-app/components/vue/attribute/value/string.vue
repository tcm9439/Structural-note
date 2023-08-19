<script setup lang="ts">
import { AttributeValue } from "structural-core"

const props = defineProps<{
    str_value: AttributeValue<string>,
}>()

const value = ref(props.str_value.value)

</script>

<template>
    <Input v-model="value"></Input>
</template>