<script setup lang="ts">
</script>

<template>
    <div class="mt-layout-header">
        <slot />
    </div>
    <div class="mt-layout-header-padding"></div>
</template>

<style scoped>
.mt-layout-header-padding {
    width: 100%;
    height: max(6vh, 30px);
}

.mt-layout-header {
    position: fixed;
    width: 100%;
    background-color: #515A6E;
    z-index: 20;
}
</style>