<script setup lang="ts">
import { MdEditor, MdPreview, type ToolbarNames } from "md-editor-v3"
import "md-editor-v3/lib/preview.css"
import "md-editor-v3/lib/style.css"

const props = defineProps<{
    content: string,
}>()

const content = computed({
    get: () => props.content,
    set: (v) => emit('update:content', v)
})

const emit = defineEmits<{
    (event: 'update:content', content: any): void
}>()

// show preview or editor depends on focus or not
const focus = ref(false)
function onFocus(){
    focus.value = true
}

// if content is empty, show hints instead of preview
const empty_content = computed(() => props.content == null || props.content.trim() === "")

// only show part of the toolbar
const md_editor_exclude: ToolbarNames[] = [
    "save", "github", "htmlPreview", "catalog",
]

const md_div = ref(null)
onClickOutside(md_div, (event) => {
    focus.value = false
})

</script>

<template>
    <!-- TODO unique editor id -->
    <div @dblclick="onFocus" ref="md_div" class="md-element full-width-attr">
        <!-- Editor -->
        <MdEditor v-if="focus" editorId="edit" v-model="content" :toolbarsExclude="md_editor_exclude" :tabWidth="4" codeTheme="github" language="en-US"/>

        <!-- Empty preview -->
        <div v-else-if="empty_content" class="empty-content">
            Double click to add content.
        </div>

        <!-- Preview with content -->
        <MdPreview v-else editorId="preview" v-model="content" />
    </div>
</template>

<style scoped>
.full-width-attr {
    width: 100%;
}

.md-element {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 2px;
}

.empty-content {
    padding: 5px;
    background-color: white;
    color: lightgrey;
}
</style>