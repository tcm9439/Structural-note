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

const focus = ref(false)
const md_div = ref(null)
const md_editor_exclude: ToolbarNames[] = [
    "save", "github", "htmlPreview", "catalog",
]
function onFocus(){
    console.log("focus")
    focus.value = true
}

onClickOutside(md_div, (event) => {
    console.log("blur")
    focus.value = false
})

</script>

<template>
    <div @dblclick="onFocus" ref="md_div" class="md-element">
        <MdEditor v-if="focus" editorId="edit" v-model="content" :toolbarsExclude="md_editor_exclude" :tabWidth="4" codeTheme="github" language="en-US"/>
        <MdPreview v-else editorId="preview" v-model="content" />
    </div>
</template>

<style scoped>
.md-element{
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 2px;
}
</style>