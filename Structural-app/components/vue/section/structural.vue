<script setup lang="ts">
import { StructuralSection } from 'structural-core';

const props = defineProps<{
    section: StructuralSection,
}>()
</script>

<template>
    <vue-section-base :section="props.section">
        <template #operations>
            <Button type="primary">TODO</Button>
        </template>
    </vue-section-base>
</template>