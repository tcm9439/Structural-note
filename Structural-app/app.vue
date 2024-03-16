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

onMounted(() => {
    // register global keyup event (only when this app is focused)
    document.addEventListener("keyup", onKeyUp)
})

onBeforeUnmount(() => {
    $emitter.off(EventConstant.SETTING_UPDATED, reloadPage)
    document.removeEventListener("keyup", onKeyUp)
})

// === keydown event handler ===
function onKeyUp(event: KeyboardEvent){
    if (event.ctrlKey || event.altKey){
        if (event.code === "KeyS"){
            event.preventDefault()
            onSave()
        } else if (event.shiftKey && event.code === "KeyU"){
            event.preventDefault()
            onRedo()
        } else if (event.code === "KeyU"){
            event.preventDefault()
            onUndo()
        }
    }
}

function onSave(){
    ShortcutHandler.saveHandler()
}

function onUndo(){
    ShortcutHandler.undoHandler()
}

function onRedo(){
    ShortcutHandler.redoHandler()
}

</script>

<template>
    <div :key="reload_key">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
