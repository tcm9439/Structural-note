import type { BaseTranslation } from '../i18n-types.js'

const en = {
    structural: {
        header: {
            file_menu: "File",
            file_open: "Open",
            file_close: "Close",
            file_save: "Save",
            file_save_as: "Save As",
            file_export_submenu: "Export",
            file_export_md: "Export to Markdown",
            file_export_txt: "Export to Text",
            setting_menu: "Setting",
            edit_menu: "Edit",
            edit_undo: "Undo",
            edit_redo: "Redo",
            window_menu: "Window",
            window_new: "New Window",
        },
        file: {
            title: "File",
            note: "Note",
            create_note: "Create Note",
            open_existing_note: "Open Existing Note",
            filename: "Filename",
            note_name: "Note Name",
            untitled: "Untitled",
            saved: "Saved",
            export: {
                export: "Export",
                preview_title: "Preview export file:",
            },
        },
        template: {
            template: "Template",
            select_template: "Select A Template",
            blank: "Blank",
            tutorial: "Tutorial",
        },
        section: {
            section: "Section",
            add_section: "Add Section",
            add_text_section: "Add Text Section",
            add_struct_section: "Add Structural Section",
            add_section_definition: "Add Definition",
            new_section_default_title: "New Section",
        },
        element: {
            element: "Element",
            add_element: "Add Element",
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
            attr_table_name_col: "Name",
            attr_table_type_col: "Type",
            attr_table_description_col: "Description",
            attr_table_action_col: "Action",
            edit_attr_basic_tab_title: "Basic",
            edit_attr_type_tab_title: "Type",
            edit_attr_basic_name_label: "Name",
            edit_attr_basic_description_label: "Description",
            edit_attr_constraint_default_label: "Default Value",
            edit_attr_choose_type_label: "Choose Attribute Type",
            update_attr_def_confirm: "Definition Updated",
            invalid_definition: "Invalid {target:string} Definition",
        },
        attribute: {
            attribute: "Attribute",
            type: {
                type: "Type",
                string: "Text",
                long_string: "Long Text",
                int: "Integer",
                boolean: "Boolean",
                decimal: "Decimal",
                markdown: "Markdown",
                enum: "Enumeration",
            },
            constraint: {
                constraint: "Constraint",
                require: "Required",
                unique: "Unique",
                min: "Minimum",
                max: "Maximum",
                regex: "Pattern (Regex)",
                enum: "Enumeration List",
                param: {
                    inclusive_label: "(inclusive)",
                },
                error: {
                    min_val_is_null: "The minimum value is not set.",
                    max_val_is_null: "The maximum value is not set.",
                    invalid_regex: "Invalid regex pattern",
                    val_less_than_min: "Value < minimum",
                    val_larger_than_max: "Value > maximum",
                    val_not_unique: "Value is duplicated",
                    attr_is_required: "This attribute is required",
                    val_not_match_regex: "Not matching pattern",
                    val_not_in_enum: "Not in set",
                }
            },
            value: {
                double_click_to_edit: "Double click to edit",
            },
            error: {
                no_attr: "There must be at least one attribute definition.",
                empty_attr_name: "Attribute name cannot be empty.",
                empty_attr_type: "Attribute type cannot be empty for attribute '{name: string}'.",
                attr_name_duplicated: "The attribute name '{name:string}' is not unique.",
                general_invalid_attr: "Invalid attribute '{attr_name:string}'",
                invalid_value_for_attr: "Invalid value for attribute '{attr_name:string}':",
                invalid_default_value_for_attr: "Invalid default value for attribute '{attr_name:string}':",
                missing_constraint_for_attr_type: "Missing constraint '{constraint:string}' for this attribute type",
                invalid_constraint_for_attr: "Constraint '{constraint:string}' for attribute '{attr_name:string}' is invalid:",
                incompatible_constraint_for_attr: "Constraint '{constraint_a:string}' is not compatible to constraint {constraint_b:string} for attribute '{attr_name:string}'",
                json: {
                    invalid_format : {
                        title: "Invalid JSON Format",
                        message: "Invalid JSON format for component {component:string}.",
                    },
                    invalid_data : {
                        title: "Invalid Data",
                        message: "Invalid Data for component {component:string}.",
                    },
                },
            },
        },
        setting: {
            title: "Setting",
            lang: "Language",
            save_before: {
                content: "Save the note before updating the setting.",
            }
        }
    },
    common: {
        confirm: "Confirm",
        save_confirm_window: {
            title: "Save {target:string}",
            content: "Do you want to save the changes?",
            save: "Save",
            do_not_save: "Don't Save",
        },
        tag_editor_tooltip: "Click to input new item. Press enter to add.",
        create: "Create",
        cancel: "Cancel",
        success: "Success",
        saved: "Saved",
        add: "Add",
        delete: "Delete",
        error: "Error",
        loading: "Loading...",
    },
    symbol: {
        colon: ":",
    },
    error: {
        general: {
            title: "Error",
            open_note: "Fail to open note.",
            create_note: "Fail to open note.",
            message: "Something went wrong.",
            unsupported: {
                title: "Unsupported operation",
                message: "Operation '{0}' not implemented or not supported.",
            },
        },
        attribute: {
            invalid_type_conversion: {
                title: "Invalid Type Conversion",
                message: "Cannot convert data from type {0} to type {1}.",
            },
            null_attr_type: {
                title: "Null Attribute Type",
                message: "Attribute Type cannot be null.",
            },
            incompatible_constraint: {
                title: "Incompatible Constraint",
                message: "New {0} constraint not compatible to existing {1} constraint.",
            },
            forbidden_constraint: {
                title: "Forbidden Constraint",
                message: "{0} constraint is not allowed for this attribute.",
            },
        },
        conversion: {
            invalid_json_format: {
                title: "Invalid JSON Format",
                message: "Fail to parse {0} from json.",
            },
            invalid_data: {
                title: "Invalid Data",
                message: "Fail to parse {0} due to invalid data.",
            },
        },
        file: {
            invalid_path: {
                title: "Invalid File Path",
                message: "The file path is invalid.",
            },
            already_opened: {
                title: "File Already Opened",
                message: "The file '{0}' is already opened in some window.",
            },
            io: {
                title: "File IO Error",
                message: "Something went wrong when accessing the file.",
            },
        },
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
