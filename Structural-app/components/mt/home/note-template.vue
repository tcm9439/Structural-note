<script setup lang="ts">
import { NOTE_TEMPLATES } from "@/composables/assets-helper/template-helper"
import { tran } from "~/composables/app/translate"

const templates = NOTE_TEMPLATES
const choice = ref<string>("blank")
const emit = defineEmits<{
    (event: 'select', id: string): void
}>()
function selectTemplate(id: string){
    choice.value = id
    emit('select', id)
}
</script>

<template>
    <div class="mt-template-label">
        {{ tran("structural.template.select_template") }}
    </div>
    <div class="mt-template-list-container">
        <mt-common-image-choice 
        v-for="template in templates"
        :id="template.id" 
        :label="template.label.toDisplayText()"
        :chosen="choice == template.id" 
        :image_path="template.image_path" 
        @select="selectTemplate" />
    </div>
</template>

<style lang="less" scoped>
.mt-template-label {
    margin: 4px 0px;
}

.mt-template-list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100px;
    max-height: 50vh;
    overflow-y: auto;
    margin-top: 10px;
}
</style>