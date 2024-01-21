<script setup lang="ts">
import { Note, NoteSection, StructuralSection, TextElement, AttributeDefinition, AttributeValue, ShortStringAttribute, StructuralElement, MarkdownElement, MarkdownAttribute, AppPage, EventConstant, RequireConstraint, UniqueConstraint, EnumAttribute, ConstraintType, EnumConstraint } from "@structural-note/structural-core"

const { $viewState, $emitter } = useNuxtApp()
$viewState.last_page = AppPage.TEST
$emitter.emit(EventConstant.LAYOUT_UPDATE, AppPage.TEST)

let test_note: Ref<Note> = ref(new Note("My first note")) as Ref<Note>
$viewState.setOpenNote(test_note.value)

let section1 = new NoteSection("Section 1")
let ele1 = new TextElement("Hello world.")
let ele2 = new TextElement("======> Yeah <======")
let ele_markdown = new MarkdownElement("## Markdown element\n`some code`")
section1.elements.add(ele1)
section1.elements.add(ele2)
section1.elements.add(ele_markdown)
test_note.value.sections.add(section1)

let section2 = new StructuralSection("Section struct")

let attr_definition = new AttributeDefinition("test string attr", ShortStringAttribute.instance, "description 1")
attr_definition.setGetAllRelatedValuesFunc(section2.getValuesOfAttr.bind(section2))
attr_definition.addConstraint(new UniqueConstraint())

let attr_definition2 = new AttributeDefinition("test string attr2", ShortStringAttribute.instance)
attr_definition2.setGetAllRelatedValuesFunc(section2.getValuesOfAttr.bind(section2))
attr_definition2.addConstraint(new RequireConstraint())

let md_attr_definition = new AttributeDefinition("test markdown attr", MarkdownAttribute.instance)
md_attr_definition.setGetAllRelatedValuesFunc(section2.getValuesOfAttr.bind(section2))

let enum_attr_definition = new AttributeDefinition("test enum attr", EnumAttribute.instance)
let enum_constraint = enum_attr_definition.getConstraint(ConstraintType.ENUM) as EnumConstraint
enum_constraint.addAvailableValue("EnumOne")
enum_constraint.addAvailableValue("EnumTwo")
enum_attr_definition.setGetAllRelatedValuesFunc(section2.getValuesOfAttr.bind(section2))

section2.definition.display_key.addKey(attr_definition)
section2.definition.attributes.add(attr_definition)
section2.definition.attributes.add(attr_definition2)
section2.definition.attributes.add(md_attr_definition)
section2.definition.attributes.add(enum_attr_definition)

let ele_struct = new StructuralElement(section2.definition)
let value = new AttributeValue(attr_definition, "Random value")
ele_struct.values.set(attr_definition.id, value)
value = new AttributeValue(attr_definition2, "Foo")
ele_struct.values.set(attr_definition2.id, value)
value = new AttributeValue(md_attr_definition, "### Markdown value\n`some other code`")
ele_struct.values.set(md_attr_definition.id, value)
section2.elements.add(ele_struct)

let ele3 = new TextElement("ABCDEFG")
section2.elements.add(ele3)

ele_struct = new StructuralElement(section2.definition)
value = new AttributeValue(attr_definition, "Random value")
ele_struct.values.set(attr_definition.id, value)
section2.elements.add(ele_struct)

test_note.value.sections.add(section2)
</script>

<template>
    <mt-note :note="test_note" v-if="test_note !== null"/>
</template>