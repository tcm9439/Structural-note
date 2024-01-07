<script setup lang="ts">
import { ConverterType } from "structural-core"
import { tran } from "~/composables/app/translate"
import { NoteExportHandler } from "~/composables/handler/NoteExportHandler"

const { $viewState } = useNuxtApp()

const props = defineProps<{
    type: ConverterType,
}>()

const emit = defineEmits<{
    (event: 'complete'): void
}>()

const converter_type = NoteExportHandler.getConverter(props.type)
const converted_content = ref(converter_type.converter.convert($viewState.editing_note!))
const loading = ref(false)
function save(){
    loading.value = true
    NoteExportHandler.exportToFile(converted_content.value, converter_type.file_extension, 
        () => {
            loading.value = false
        },
        () => {
            loading.value = false
            emit("complete")
        })
}

function cancel(){
    emit("complete")
}

</script>

<template>
    <Modal
        :modelValue="true"
        :title="tran('structural.file.export.preview_title')"
        :closable="false"
        :mask-closable="false"
        fullscreen
        width="85"
    >
    <div class="mt-convert-preview-container">
        <template v-if="props.type === ConverterType.MARKDOWN">
            <mt-editor-markdown v-model:content="converted_content" />
        </template>
        <template v-if="props.type === ConverterType.TEXT">
            <mt-attribute-value-editor 
                type="LONG_STRING"
                v-model:value="converted_content" 
                full_width
            />
        </template>
        <Spin size="large" fix :show="loading"></Spin>
    </div>

    <template #footer>
        <div>
            <Button @click="cancel">
                {{ tran("common.cancel") }}
            </Button>
            <Button @click="save" type="primary">
                {{ tran("structural.file.export.export") }}
            </Button>
        </div>
    </template>
        
    </Modal>
</template>

<style scoped>
/* 
.mt-convert-preview-container {
    overflow-y: auto;
    max-height: 60vh;
}

:deep(.md-editor-previewOnly) {
    max-height: 55vh;
} 
*/
</style>