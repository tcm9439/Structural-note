<script setup lang="ts">
import { NoteSection, EditPath, Note, InjectConstant, ComponentVForElement, TextElement } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { elementListGetter } from "@/composables/active-data/ElementListGetter"
import { elementComponentMapper } from "@/composables/active-data/ElementComponentMapper"

const props = defineProps<{
    edit_path: EditPath,
}>()

const editing_note: Note | undefined = inject(InjectConstant.EDITING_NOTE)
const section = shallowReactive(activeDataGetter(editing_note, props.edit_path) as NoteSection)
const section_elements = ref(null) as Ref<ComponentVForElement[] | null>
console.log("Loaded section", section.id, section.title)

watch(() => section.elements.length(), () => {
    section_elements.value = elementListGetter(editing_note, section, props.edit_path, elementComponentMapper)
}, { immediate: true })

function addElement(temp: string){
    if (temp === "text"){
        const new_section = new TextElement()
        section.elements.add(new_section)
    }
}
</script>

<template>
    <Card v-if="section != null">
        <template #title>
            <Input v-model="section.title" :border="false" />
        </template>

        <template #extra>
            <Dropdown @on-click="addElement">
                <a href="javascript:void(0)">
                    <Icon type="md-add" />
                </a>
                <template #list>
                    <DropdownMenu>
                        <!-- TODO make this dynamically depends on the section type -->
                        <DropdownItem name="text">Add text section</DropdownItem>
                        <DropdownItem name="dummy">dummy</DropdownItem>
                    </DropdownMenu>
                </template>
            </Dropdown>
            <slot name="operation"></slot>
        </template>
        
        <slot name="content"></slot>
    
        <template v-for="element of section_elements" :key="element.id">
            <component :is="element.type" :edit_path="element.path" />
        </template>
    </Card>
</template>