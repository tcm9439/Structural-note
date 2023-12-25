<script setup lang="ts">
import { AppPage, EventConstant } from "structural-core"
const { $viewState, $emitter } = useNuxtApp()
$viewState.last_page = AppPage.HOME
$emitter.emit(EventConstant.LAYOUT_UPDATE, AppPage.HOME)

</script>

<template>
    <mt-layout-home />
</template>