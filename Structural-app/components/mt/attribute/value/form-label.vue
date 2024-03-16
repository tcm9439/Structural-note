<script setup lang="ts">
const props = defineProps<{
    label: string
    required: boolean
    description: string
}>()

const empty_description = computed(() => {
    return props.description == ""
})

</script>

<template>
    <Tooltip 
        :disabled="empty_description" placement="top" 
        max-width="250"
        :content="props.description" :delay="500">
        <span v-if="props.required" class="mt-form-item-required">* </span>
        <span class="form-item-label">{{ props.label }}</span>
    </Tooltip>
</template>

<style scoped>
.mt-form-item-required {
    color: #f5222d;
    margin-left: 2px;
}
</style>