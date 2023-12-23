import type { Translation } from "../i18n-types.js"

const zh_HK = {
    structural: {
        file: {
            title: "檔案",
            untitled: "未命名",
            open: "開啟檔案",
            create_note: "新增筆記",
            save: "儲存檔案",
            save_as: "另存新檔",
            close: "關閉",
            export: "匯出",
            export_md: "匯出成 Markdown",
        },
        section: {
            add_text_section: "新增文字段落",
            add_struct_section: "新增結構段落",
            add_section_definition: "新增結構定義",
            new_section_default_title: "新段落",
        },
        element: {
            add_text_element: "新增文字單元",
            add_markdown_element: "新增 Markdown 單元",
            add_struct_element: "新增結構單元",
        },
        struct_def: {
            section_def_title: "結構定義",
            attributes_tab_title: "欄目定義",
            display_name_tab_title: "顯示名稱",
            display_name_separator_label: "分隔符號",
            display_name_table_name_col: "欄目",
            display_name_table_action_col: "操作",
            attr_list_name_col: "欄目",
            attr_list_type_col: "類型",
            attr_list_description_col: "描述",
            attr_list_action_col: "操作",
            edit_attr_basic_tab_title: "基本",
            edit_attr_type_tab_title: "類型",
            edit_attr_basic_name_label: "欄目名稱",
            edit_attr_basic_description_label: "描述",
            edit_attr_constrain_default_label: "預設值",
            edit_attr_choose_type_label: "選擇欄目類型",
            edit_attr_current_type_label: "目前欄目類型：",
            edit_attr_change_to_type_label: "變更欄目類型為：",
            update_attr_def_confirm: "更新定義",
        },
        attribute: {
            type: {
                string: "文字",
                int: "整數",
                boolean: "是非值",
                decimal: "小數",
                markdown: "Markdown",
            },
            constrain: {
                required: "必填",
                unique: "獨一無二",
                min: "最小值",
                max: "最大值",
            },
        },
        setting: {
            title: "設定",
            lang: "語言",
        }
    },
    common: {
        confirm: "確認",
        cancel: "取消",
        add: "新增",
        delete: "刪除",
    },
    test: {
		no_parameter: "你好!",
		named_parameter: "你好 {name}!",
		named_parameter2: "你好 {last_name}{first_name}!",
		numbered_parameter: "你好 {0} {1}!",
		numbered_parameter2: "你好 {1} {0}!",
	}
} satisfies Translation

export default zh_HK
