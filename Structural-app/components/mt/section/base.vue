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
const rerender_elements = ref(0)

watch([() => section.elements.length(), rerender_elements], () => {
    section_elements.value = elementListGetter(editing_note, section, props.edit_path, elementComponentMapper)
}, { immediate: true })

function addElement(temp: string){
    if (temp === "text"){
        const new_section = new TextElement()
        section.elements.add(new_section)
    }
}

function removeElement(element_id: string){
    section.elements.remove(element_id)
}

function moveUpElement(element_id: string){
    rerender_elements.value += 1
    section.elements.moveUp(element_id)
}

function moveDownElement(element_id: string){
    rerender_elements.value += 1
    section.elements.moveDown(element_id)
}

</script>

<template>
    <Card v-if="section != null" class="section-card">
        <template #title>
            <div class="section-title">
                <Input v-model="section.title" :border="false"/>
            </div>
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
            <mt-element-base :id="element.id" @delete="removeElement" @move-up="moveUpElement" @move-down="moveDownElement">
            <template #content>
                <component :is="element.type" :edit_path="element.path" />
                </template>
            </mt-element-base>
        </template>
    </Card>
</template>

<style scoped>
    .section-card {
        margin-bottom: 20px;
    }

    .section-title :deep(.ivu-input-no-border) {
        font-weight: bold;
    }
</style>