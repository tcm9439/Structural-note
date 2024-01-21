<script setup lang="ts">
import { NoteSection, EditPath, Note, NoteElement, InjectConstant, type ComponentVForElement, TextElement, ElementType, EventConstant, MarkdownElement, RemoveComponentsCommand, AddComponentsCommand } from "@structural-note/structural-core"
import { activeDataGetter } from "@/composables/active-data/ActiveDataGetter"
import { elementListGetter, availableElementComponentGetter, elementComponentMapper, type AvailableElementComponent } from "@/composables/active-data/Element"
import { Icon } from "view-ui-plus"
import { type AvailableSection } from "@/composables/active-data/Note"
import { tran } from "~/composables/app/translate"
const { $emitter, $viewState } = useNuxtApp()

const props = defineProps<{
    edit_path: EditPath,
    available_section_types: AvailableSection[]
    render_available_element?: number,
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
let available_element_types: Ref<AvailableElementComponent[]> = ref([])
watch(() => props.render_available_element, () => {
    available_element_types.value = availableElementComponentGetter(section)
}, { immediate: true })

function addElement(element_type: string, last_element_id?: string){
    // if element_type is available in NoteSection, add it directly
    // else, emit event to the extended section component
    let new_element: NoteElement
    switch(element_type as ElementType){
        case ElementType.TEXT:
            new_element = new TextElement()
            break
        case ElementType.MARKDOWN:
            new_element = new MarkdownElement()
            break
        default:
            emit("addElement", element_type as ElementType, last_element_id)
            return
    }
    // section.elements.addAfter(new_element, last_element_id)
    $viewState.history.push(new AddComponentsCommand(new_element, section.elements, () => {
        section.elements.addAfter(new_element, last_element_id)
    }))
}

function removeElement(element_id: string){
    // section.elements.remove(element_id)
    $viewState.history.push(RemoveComponentsCommand.newById(element_id, section.elements))
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

        <!-- Operation Buttons -->
        <template #extra>
            <!-- Child class operation -->
            <slot name="operation"></slot>

            <ButtonGroup class="section-operation-button-gp">
                <Button @click="moveUpSection" type="primary" ghost>
                    <Icon type="md-arrow-up" />
                </Button>
                <Button @click="moveDownSection" type="primary" ghost>
                    <Icon type="md-arrow-down" />
                </Button>
                <Button @click="removeSection" type="primary" ghost>
                    <Icon type="md-trash" />
                </Button>

                <!-- Add section button -->
                <Dropdown @on-click="addSection" trigger="click" class="add-section-dropdown">
                    <Button type="primary" ghost>
                        <Icon type="md-add"/>
                    </Button>
                    <template #list>
                        <DropdownItem v-for="section_type in props.available_section_types" :name="section_type.id">
                            {{section_type.display_choice }}
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
                    <DropdownItem v-for="element_type in available_element_types" 
                        :name="element_type.id"
                        :disabled="element_type.disable"
                    >
                        {{element_type.display_choice}}
                    </DropdownItem>
                </template>
                <template #content>
                    <component :is="element.type" :edit_path="element.path" />
                </template>
            </mt-element-base>
        </template>

        <slot name="body"></slot>

        <!-- Add element button -->
        <div class="add-element-container">
            <Dropdown 
                class="add-element-button"
                @on-click="addElement" 
                trigger="click">
                <Button shape="circle" icon="md-add" long>
                    {{ tran("structural.element.add_element") }}
                </Button>
                
                <template #list>
                    <DropdownMenu>
                        <DropdownItem v-for="element_type in available_element_types" 
                            :name="element_type.id"
                            :disabled="element_type.disable"
                        >
                            {{ element_type.display_choice }}
                        </DropdownItem>
                    </DropdownMenu>
                </template>
            </Dropdown>
        </div>
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

:deep(.section-operation-button-gp) {
    margin-right: 8px;
}

:deep(.ivu-btn-group > .ivu-dropdown.add-section-dropdown > .ivu-dropdown-rel > .ivu-btn){
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin-left: -1px
}
</style>