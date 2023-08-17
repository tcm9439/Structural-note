<script setup lang="ts">
import { ref, Ref, reactive } from 'vue'
import { Note, TextAreaSection } from "structural-core"

let test_note = reactive(new Note("My first note"))
let section1 = new TextAreaSection("Section 1")
section1.content = "This is the content of section 1"
test_note.sections.add(section1)

console.log(test_note.sections.components)

</script>

<template>
    <vue-note :note="test_note" />
</template>