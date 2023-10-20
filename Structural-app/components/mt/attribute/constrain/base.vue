<script setup lang="ts">
import { AttributeDefinition, ConstrainType } from "structural-core";
import { AttrConstrainEditComponent } from "@/composables/active-data/Constrain"

const props = defineProps<{
    params: AttrConstrainEditComponent;
    attr_def: AttributeDefinition<any>;
    render: number;
}>();

const emit = defineEmits<{
    (event: "update", is_set: boolean, type: ConstrainType, id: string | null): void;
}>();

const show_editor = ref(false);
const label = ref("");

watch(
    () => props.render,
    () => {
        show_editor.value = props.params.path !== null;
        label.value = props.params.label;
    },
    { immediate: true }
);

function onToggleConstrain() {
    emit("update", show_editor.value, props.params.constrain_type, props.params.id);
}
</script>

<template>
    <FormItem :prop="label + '_checkbox'">
        <Checkbox v-model="show_editor" @on-change="onToggleConstrain">
            {{ label }}
        </Checkbox>
    </FormItem>
    <template v-if="show_editor">
        <component
            :is="props.params.component_type"
            :id="props.params.id"
            :edit_path="props.params.path"
            :attr_def="attr_def" />
    </template>
</template>
