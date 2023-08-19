<script setup lang="ts">
import { ref, Ref, reactive } from 'vue'
import { Note, NoteSection, StructuralSection, TextElement, AttributeDefinition, AttributeValue, StringAttribute, StructuralElement } from "structural-core"

let test_note: Ref<Note> = ref(new Note("My first note")) as Ref<Note>

let section1 = new NoteSection("Section 1")
let ele1 = new TextElement("Hello world.")
let ele2 = new TextElement("======> Yeah <======")
section1.elements.add(ele1)
section1.elements.add(ele2)
test_note.value.sections.add(section1)

let section2 = new StructuralSection("Section struct")

let attr_definition = new AttributeDefinition("test", StringAttribute.instance)
section2.definition.attributes.add(attr_definition)

let ele_struct = new StructuralElement(section2.definition)
let value = new AttributeValue(attr_definition, "Random value")
ele_struct.values.set(attr_definition.id, value)

section2.elements.add(ele_struct)
test_note.value.sections.add(section2)

</script>

<template>
    <vue-note :note="test_note" />
</template>