<script setup lang="ts">
import { EditPath, Note, InjectConstant, ComponentVForElement } from "structural-core"
import { elementListGetter } from "@/composables/active-data/ElementListGetter"
import { sectionComponentMapper } from "@/composables/active-data/SectionComponentMapper"


const props = defineProps<{
    note: Note,
}>()

// Provide the note in edit to the children
// const editing_note = ref(props.note) as Ref<Note>
provide(InjectConstant.EDITING_NOTE, props.note)
// The children will use this path to get the node from the editing note
const edit_path = new EditPath()

// TODO move the edit note name setting to the place that open & load / create  the note
const { $viewState } = useNuxtApp()
$viewState.editing_note_name = props.note.title

const sections = ref(null) as Ref<ComponentVForElement[] | null>
watch(() => props.note.sections.length(), () => {
    sections.value = elementListGetter(props.note, props.note, edit_path, sectionComponentMapper)
}, { immediate: true })

</script>

<template>
    <template v-for="section of sections">
        <component :is="section.type" :edit_path="section.path" />
    </template>
    <!-- {{ editing_note }} -->
</template>composables/active-data/SectionComponent