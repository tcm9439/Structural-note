<script setup lang="ts">
import { EventConstant, AppPage, AppState } from "structural-core"
const { $emitter } = useNuxtApp()

const layout_type = ref("note")
function updateLayout(new_layout_type: AppPage){
    AppState.logger.trace("Update header layout - " + new_layout_type + AppPage.SETTING)
    switch (new_layout_type) {
        case AppPage.SETTING:
            layout_type.value = "none"
            break
        default:
            layout_type.value = "note"
            break
    }
}

$emitter.on(EventConstant.LAYOUT_UPDATE, updateLayout)
onBeforeUnmount(() => {
    $emitter.off(EventConstant.LAYOUT_UPDATE, updateLayout)
})
</script>

<template>
    <div class="layout">
        <mt-layout-header-none v-if="layout_type == 'none'" />
        <mt-layout-header-note v-else-if="layout_type == 'note'"/>
        
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<style scoped>
    .layout {
        /* height = 100% screen - header height */
        min-height: calc(100vh - 40px);
    }

    .content {
        margin: 20px 20px 0;
        min-height: 100%;
    }
</style>