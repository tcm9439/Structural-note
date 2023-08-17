<script setup lang="ts">
import { TextElement } from "structural-core"

const props = defineProps<{
    text: TextElement,
}>()

</script>

<template>
    <div>
        <p>{{ props.text.content }}</p>
    </div>
</template>