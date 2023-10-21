# Extending this App

## Adding Element Type
- core
  - index.ts
  - NoteElement.ts > ElementType enum
  - NoteSection.ts (& child) > available_element_types
- app
  - composables/Element.ts > elementComponentMapper & availableElementComponentGetter
  - section/base.vue (or extended section) > addElement
  - element/newElement.vue

## Adding Attribute Type
- core
  - index.ts
  - AttributeTypeInitializer
  - NewAttributeType extending AttributeType<any>
  - add converter (if any)
- app
  - value-editor.vue
  - attr-type-choice.vue 
