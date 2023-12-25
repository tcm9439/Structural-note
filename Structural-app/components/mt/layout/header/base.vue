<script setup lang="ts">
</script>

<template>
    <div class="mt-layout-header">
        <slot />
    </div>
</template>

<style scoped>
.mt-layout-header {
    position: fixed;
    width: 100%;
    background-color: #515A6E;
    z-index: 20;
    /* max-height: max(8vh, 40px); */
}
</style>