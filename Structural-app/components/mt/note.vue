<script setup lang="ts">
import { EditPath, Note, InjectConstant, type ComponentVForElement, EventConstant, SectionTypeMapper, SectionType } from "structural-core"
import { elementListGetter } from "@/composables/active-data/Element"
import { sectionComponentMapper } from "@/composables/active-data/Section"
import { getAvailableSection } from "@/composables/active-data/Note"
const { $emitter } = useNuxtApp()

const props = defineProps<{
    note: Note,
}>()

// Provide the note in edit to the children
// const editing_note = ref(props.note) as Ref<Note>
provide(InjectConstant.EDITING_NOTE, props.note)
// The children will use this path to get the node from the editing note
const edit_path = new EditPath()

const { $viewState } = useNuxtApp()
$viewState.editing_note = props.note

const rerender_section = ref(0)
const sections = ref(null) as Ref<ComponentVForElement[] | null>
const no_section = computed(() => props.note.sections.length() === 0)
watch([() => props.note.sections.length(), rerender_section], () => {
    sections.value = elementListGetter(props.note, props.note, edit_path, sectionComponentMapper)
}, { immediate: true })

// # Section
const available_section_types = ref(getAvailableSection())
function addSection(section_type: string, last_section_id?: string){
    let section_class = SectionTypeMapper.get(section_type as SectionType)
    if (section_class != null){
        let new_section = new section_class()
        props.note.sections.addAfter(new_section, last_section_id)
    }
}
function removeSection(section_id: string){
    props.note.sections.remove(section_id)
    rerender_section.value += 1
}

function moveUpSection(section_id: string){
    props.note.sections.moveUp(section_id)
    rerender_section.value += 1
}

function moveDownSection(section_id: string){
    props.note.sections.moveDown(section_id)
    rerender_section.value += 1
}

$emitter.on(EventConstant.ADD_SECTION, addSection);
$emitter.on(EventConstant.REMOVE_SECTION, removeSection);
$emitter.on(EventConstant.MV_UP_SECTION, moveUpSection);
$emitter.on(EventConstant.MV_DOWN_SECTION, moveDownSection);

onBeforeUnmount(() => {
    $emitter.off(EventConstant.ADD_SECTION, addSection);
    $emitter.off(EventConstant.REMOVE_SECTION, removeSection);
    $emitter.off(EventConstant.MV_UP_SECTION, moveUpSection);
    $emitter.off(EventConstant.MV_DOWN_SECTION, moveDownSection);
})

</script>

<template>
    <div class="add-section-container">
        <Dropdown 
            class="add-section-button"
            v-if="no_section"
            @on-click="addSection" 
            trigger="click">
            <Button type="primary" shape="circle" icon="md-add" long>
                Add section
            </Button>
            
            <template #list>
                <DropdownMenu>
                    <DropdownItem v-for="section_type in available_section_types" :name="section_type.id">
                        {{ section_type.display_choice }}
                    </DropdownItem>
                </DropdownMenu>
            </template>
        </Dropdown>
    </div>

    <template v-for="section of sections" :key="section.id">
        <!-- Section List -->
        <component :is="section.type" 
            :edit_path="section.path" 
            :available_section_types="available_section_types" 
        />
    </template>
    <!-- {{ editing_note }} -->
</template>

<style>
.add-section-button.ivu-dropdown {
    width: 80%;
}

.add-section-container {
    width: 100%;
    text-align: center;
}
</style>