<script setup lang="ts">
import { NoteSection, EditPath, Note, InjectConstant, ComponentVForElement, TextElement, ElementType, EventConstant } from "structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { elementListGetter, availableElementComponentGetter, elementComponentMapper } from "@/composables/active-data/Element"
import { Icon } from "view-ui-plus"
import { type AvailableSection } from "@/composables/active-data/Note"
const { $emitter } = useNuxtApp()

const props = defineProps<{
    edit_path: EditPath,
    available_section_types: AvailableSection[]
}>()

const emit = defineEmits<{
    (event: 'addElement', element_type: ElementType, last_element_id?: string): void
}>()

const editing_note: Note | undefined = inject(InjectConstant.EDITING_NOTE)
const section = shallowReactive(activeDataGetter(editing_note, props.edit_path) as NoteSection)
const section_elements = ref(null) as Ref<ComponentVForElement[] | null>
const rerender_elements = ref(0)
const no_element = computed(() => section.elements.length() === 0)

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

function removeSection(){
    $emitter.emit(EventConstant.REMOVE_SECTION, section.id)
}

function moveUpSection(){
    $emitter.emit(EventConstant.MV_UP_SECTION, section.id)
}

function moveDownSection(){
    $emitter.emit(EventConstant.MV_DOWN_SECTION, section.id)
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

        <!-- Add element button when there is NO element in this section -->
        <div v-if="no_element" class="add-element-container">
            <Dropdown 
                class="add-element-button"
                @on-click="addElement" 
                trigger="click">
                <Button shape="circle" icon="md-add" long>
                    Add Element
                </Button>
                
                <template #list>
                    <DropdownMenu>
                        <DropdownItem v-for="element_type in available_element_types" :name="element_type.id">
                            {{ element_type.display_choice }}
                        </DropdownItem>
                    </DropdownMenu>
                </template>
            </Dropdown>
        </div>

        <!-- Operation Buttons -->
        <template #extra>
            <!-- Child class operation -->
            <slot name="operation"></slot>

            <ButtonGroup class="section-operation-button">
                <Button @click="moveUpSection">
                    <Icon type="md-arrow-up" />
                </Button>
                <Button @click="moveDownSection">
                    <Icon type="md-arrow-down" />
                </Button>
                <Button @click="removeSection">
                    <Icon type="md-trash" />
                </Button>

                <!-- Add section button -->
                <Dropdown @on-click="addSection" trigger="click" class="add-section-dropdown">
                    <Button>
                        <Icon type="md-add"/>
                    </Button>
                    <template #list>
                        <DropdownItem v-for="section_type in props.available_section_types" :name="section_type.id">
                            {{ section_type.display_choice }}
                        </DropdownItem>
                    </template>
                </Dropdown>
            </ButtonGroup>
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

.add-element-button.ivu-dropdown {
    width: 80%;
}

.add-element-container {
    width: 100%;
    text-align: center;
}

:deep(.section-operation-button) {
    margin-right: 8px;
}

:deep(.ivu-btn-group > .ivu-dropdown.add-section-dropdown > .ivu-dropdown-rel > .ivu-btn){
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin-left: -1px
}
</style>