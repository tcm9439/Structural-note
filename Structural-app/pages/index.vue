<script setup lang="ts">
import { Note, NoteSection, StructuralSection, TextElement, AttributeDefinition, AttributeValue, StringAttribute, StructuralElement } from "structural-core"
import { TauriFileSystem } from "tauri-fs-util"
import { exists, BaseDirectory, writeTextFile, readTextFile, writeBinaryFile, createDir, readBinaryFile, removeFile } from '@tauri-apps/api/fs'

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

const output = ref("")
async function testFs(){
    try {
        output.value = ""
        output.value = output.value + "Check exists: "
        // let result = await exists("./", { dir: BaseDirectory.AppData })
        let result = await TauriFileSystem.instance.exists("test.txt")
        output.value = output.value + result + "\n"
        await TauriFileSystem.instance.writeTextFile("test.txt", "Hello world")
        output.value = output.value + "Content: "
        let content = await TauriFileSystem.instance.readTextFile("test.txt")
        output.value = output.value + content + "\n"
    } catch (error) {
        output.value = output.value + String(error)
        console.log(error)
    }
    
    console.log("Test")
}
async function testFs2(){
    try {
        output.value = ""
        output.value = output.value + "Check exists: "
        let result = await TauriFileSystem.instance.exists("dummy/test.txt")
        output.value = output.value + result + "\n"
        await TauriFileSystem.instance.writeTextFile("dummy/test.txt", "Hello world")
        output.value = output.value + "Content: "
        let content = await TauriFileSystem.instance.readTextFile("dummy/test.txt")
        output.value = output.value + content + "\n"
    } catch (error) {
        output.value = output.value + String(error)
        console.log(error)
    }
    
    console.log("Test")
}

async function testFs3(){
    try {
        output.value = ""
        output.value = output.value + "Check exists: "
        let result = await TauriFileSystem.instance.exists("")
        output.value = output.value + result + "\n"
        await TauriFileSystem.instance.createDirectory("")
        output.value = output.value + "Check exists: "
        result = await TauriFileSystem.instance.exists("")
        output.value = output.value + result + "\n"
    } catch (error) {
        output.value = output.value + String(error)
        console.log(error)
    }
    
    console.log("Test")
}

</script>

<template>
    <mt-note :note="test_note" />
    <Button @click="testFs">Test</Button>
    <Button @click="testFs2">Test2</Button>
    <Button @click="testFs3">Test3</Button>
    {{ output }}
</template>