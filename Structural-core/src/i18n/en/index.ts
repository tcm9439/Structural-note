import type { BaseTranslation } from '../i18n-types.js'

const en = {
    structural: {
        file: {
            title: "File",
            untitled: "Untitled",
            open: "Open",
            create_note: "Create Note",
            save: "Save",
            save_as: "Save As",
            close: "Close",
            export: "Export",
            export_md: "Export to Markdown",
        },
        section: {
            add_text_section: "Add Text Section",
            add_struct_section: "Add Structural Section",
            add_section_definition: "Add Definition",
            new_section_default_title: "New Section",
        },
        element: {
            add_text_element: "Add Text Element",
            add_markdown_element: "Add Markdown Element",
            add_struct_element: "Add Structural Element",
        },
        struct_def: {
            section_def_title: "Section Definition",
            attributes_tab_title: "Attributes",
            display_name_tab_title: "Display Name",
            display_name_separator_label: "Separator",
            display_name_table_name_col: "Name",
            display_name_table_action_col: "Action",
            attr_list_name_col: "Name",
            attr_list_type_col: "Type",
            attr_list_description_col: "Description",
            attr_list_action_col: "Action",
            edit_attr_basic_tab_title: "Basic",
            edit_attr_type_tab_title: "Type",
            edit_attr_basic_name_label: "Name",
            edit_attr_basic_description_label: "Description",
            edit_attr_constrain_default_label: "Default Value",
            edit_attr_choose_type_label: "Choose Attribute Type",
            edit_attr_current_type_label: "Current Attribute Type:",
            edit_attr_change_to_type_label: "Change Attribute Type To:",
            update_attr_def_confirm: "Update Definition",
        },
        attribute: {
            type: {
                string: "String",
                int: "Integer",
                boolean: "Boolean",
                decimal: "Decimal",
                markdown: "Markdown",
            },
            constrain: {
                required: "Required",
                unique: "Unique",
                min: "Min",
                max: "Max",
            },
        },
        setting: {
            title: "Setting",
            lang: "Language",
        }
    },
    common: {
        confirm: "Confirm",
        cancel: "Cancel",
        add: "Add",
        delete: "Delete",
    },
    test: {
		no_parameter: "Hello!",
		named_parameter: "Hello {name:string}!",
		named_parameter2: "Hello {first_name:string} {last_name:string}!",
		numbered_parameter: "Hello {0} {1}!",
		numbered_parameter2: "Hello {1} {0}!"
	}
} satisfies BaseTranslation

export default en
