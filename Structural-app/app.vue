<script setup lang="ts">
const { $emitter } = useNuxtApp()
import { AppState, EventConstant } from "@structural-note/structural-core"
import { ShortcutHandler } from "~/composables/handler/ShortcutHandler"
import { WindowUtil } from "~/composables/app/window"

WindowUtil.setWindowId()
const reload_key = ref(0)
function reloadPage(){
    AppState.logger.debug("Setting updated. Reload page.")
    reload_key.value++
}
$emitter.on(EventConstant.SETTING_UPDATED, reloadPage)
const unlisten_functions = await ShortcutHandler.registerAllHandler()

onBeforeUnmount(() => {
    unlisten_functions.forEach((unlisten_function) => {
        unlisten_function()
    })
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
