<script setup lang="ts">
const { $emitter } = useNuxtApp()

const reload_key = ref(0)
function reloadPage(){
    reload_key.value++
}
$emitter.on("RELOAD_PAGE", reloadPage)

onBeforeUnmount(() => {
    $emitter.off("RELOAD_PAGE", reloadPage)
})
</script>

<template>
  <div :key="reload_key">
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
  </div>
</template>
