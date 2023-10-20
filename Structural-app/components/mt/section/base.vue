<script setup lang="ts">
import { NoteSection, EditPath, Note, InjectConstant, ComponentVForElement, TextElement, ElementType } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { elementListGetter, availableElementComponentGetter } from "@/composables/active-data/ElementListGetter"
import { elementComponentMapper } from "@/composables/active-data/ElementComponentMapper"

const props = defineProps<{
    edit_path: EditPath,
}>()

const emit = defineEmits<{
    (event: 'addElement', element_type: ElementType, last_element_id: string): void
}>()

const editing_note: Note | undefined = inject(InjectConstant.EDITING_NOTE)
const section = shallowReactive(activeDataGetter(editing_note, props.edit_path) as NoteSection)
const section_elements = ref(null) as Ref<ComponentVForElement[] | null>
const rerender_elements = ref(0)

watch([() => section.elements.length(), rerender_elements], () => {
    section_elements.value = elementListGetter(editing_note, section, props.edit_path, elementComponentMapper)
}, { immediate: true })


// # Elements
const available_element_types = availableElementComponentGetter(section)
function addElement(element_type: string, last_element_id: string){
    // if element_type is available in NoteSection, add it directly
    // else, emit event to the extended section component
    let new_element
    switch(element_type as ElementType){
        case ElementType.TEXT:
            new_element = new TextElement()
            break
        default:
            emit("addElement", element_type as ElementType, last_element_id)
            return
    }
    section.elements.addAfter(new_element, last_element_id)
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
            <slot name="operation"></slot>
        </template>
        
        <slot name="content"></slot>
        <template v-for="element of section_elements" :key="element.id">
            <mt-element-base 
                :id="element.id"
                @add="addElement"
                @delete="removeElement" 
                @move-up="moveUpElement" 
                @move-down="moveDownElement">
                <template #available_element>
                    <DropdownItem v-for="element_type in available_element_types" :name="element_type.id">
                        {{ element_type.display_choice }}
                    </DropdownItem>
                </template>
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