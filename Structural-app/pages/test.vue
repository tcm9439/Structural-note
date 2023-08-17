<script setup lang="ts">
import { ref, Ref, reactive } from 'vue'
import { Note, NoteSection, NoteElement, TextElement } from "structural-core"

let test_note: Ref<Note> = ref(new Note("My first note")) as Ref<Note>
let section1 = new NoteSection("Section 1")
let section2 = new NoteSection("Section 2")
let ele1 = new TextElement("Hello world.")
let ele2 = new TextElement("======> Yeah <======")
section1.elements.add(ele1)
section1.elements.add(ele2)
test_note.value.sections.add(section1)
test_note.value.sections.add(section2)

console.log("Test: ", test_note.value.sections.orderedComponents)

</script>

<template>
    <vue-note :note="test_note" />
</template>