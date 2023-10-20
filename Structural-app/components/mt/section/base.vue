<script setup lang="ts">
import { NoteSection, EditPath, Note, InjectConstant, ComponentVForElement, TextElement, ElementType, EventConstant } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { elementListGetter, availableElementComponentGetter, elementComponentMapper } from "@/composables/active-data/Element"
import { Icon } from "view-ui-plus"
const { $emitter } = useNuxtApp()

const props = defineProps<{
    edit_path: EditPath,
}>()

const emit = defineEmits<{
    (event: 'addElement', element_type: ElementType, last_element_id?: string): void
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
function addElement(element_type: string, last_element_id?: string){
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

// # Section
function addSection(section_type: string){
    $emitter.emit(EventConstant.ADD_SECTION, section_type, section.id)
}

function removeSection(section_id: string){
    $emitter.emit('deleteSection', section.id)
}

function moveUpSection(section_id: string){
    $emitter.emit('moveUpSection', section.id)
}

function moveDownSection(section_id: string){
    $emitter.emit('moveDownSection', section.id)
}

</script>

<template>
    <Card v-if="section != null" class="section-card">
        <!-- Card Section Title -->
        <template #title>
            <div class="section-title">
                <Input v-model="section.title" :border="false"/>
            </div>
        </template>

        <!-- Operation Buttons -->
        <template #extra>
            <!-- Add section button -->
            <Dropdown 
                @on-click="addSection" 
                trigger="click">
                <Button class="section-operation-button">
                    <Icon type="md-add"/>
                    Section
                </Button>
                
                <template #list>
                    <DropdownMenu>
                        <slot name="available_section"></slot>
                    </DropdownMenu>
                </template>
            </Dropdown>

            <!-- Add element (at bottom of this section) button -->
            <Dropdown 
                @on-click="addElement" 
                trigger="click">
                <Button class="section-operation-button">
                    <Icon type="md-add"/>
                    Element
                </Button>
                
                <template #list>
                    <DropdownMenu>
                        <DropdownItem v-for="element_type in available_element_types" :name="element_type.id">
                            {{ element_type.display_choice }}
                        </DropdownItem>
                    </DropdownMenu>
                </template>
            </Dropdown>

            <Button class="section-operation-button" @click="removeSection">
                <Icon type="md-trash" />
            </Button>
            <Button class="section-operation-button" @click="moveUpSection">
                <Icon type="md-arrow-up" />
            </Button>
            <Button class="section-operation-button" @click="moveDownSection">
                <Icon type="md-arrow-down" />
            </Button>
            
            <!-- Child class operation -->
            <slot name="operation"></slot>
        </template>
        

        <!-- Elements -->
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

    :deep(.section-operation-button) {
        /* margin at left and right */
        margin: 0 4px;
    }
</style>