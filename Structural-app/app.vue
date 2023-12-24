<script setup lang="ts">
const { $emitter } = useNuxtApp()
import { AppState, EventConstant } from "structural-core"

const reload_key = ref(0)
function reloadPage(){
    AppState.logger.debug("Setting updated. Reload page.")
    reload_key.value++
}
$emitter.on(EventConstant.SETTING_UPDATED, reloadPage)

onBeforeUnmount(() => {
    $emitter.off(EventConstant.SETTING_UPDATED, reloadPage)
})
</script>

<template>
  <div :key="reload_key">
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
  </div>
</template>
