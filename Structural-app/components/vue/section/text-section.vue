<script setup lang="ts">
import { TextAreaSection } from "structural-core"

const props = defineProps<{
    text_section: TextAreaSection,
}>()

</script>

<template>
    <h2>{{ props.text_section.title }}</h2>
    <div>
        <p>{{ props.text_section.content }}</p>
    </div>
</template>