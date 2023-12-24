import type { Translation } from "../i18n-types.js"

const zh_HK = {
    structural: {
        header: {
            file_menu: "檔案",
            file_open: "開啟檔案",
            file_close: "關閉檔案",
            file_save: "儲存檔案",
            file_save_as: "另存新檔",
            file_export_submenu: "匯出",
            file_export_md: "匯出成 Markdown",
            file_export_txt: "匯出成純文字",
            setting_menu: "設定",
        },
        file: {
            title: "檔案",
            note: "筆記",
            create_note: "新增筆記",
            open_existing_note: "開啟筆記",
            filename: "檔案名稱",
            note_name: "筆記名稱",
            untitled: "未命名",
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
            attr_table_name_col: "欄目",
            attr_table_type_col: "類型",
            attr_table_description_col: "描述",
            attr_table_action_col: "操作",
            edit_attr_basic_tab_title: "基本",
            edit_attr_type_tab_title: "類型",
            edit_attr_basic_name_label: "欄目名稱",
            edit_attr_basic_description_label: "描述",
            edit_attr_constrain_default_label: "預設值",
            edit_attr_choose_type_label: "選擇欄目類型",
            edit_attr_current_type_label: "目前欄目類型",
            edit_attr_change_to_type_label: "變更欄目類型為",
            update_attr_def_confirm: "更新定義",
        },
        attribute: {
            type: {
                type: "類型",
                string: "文字",
                int: "整數",
                boolean: "是非值",
                decimal: "小數",
                markdown: "「Markdown」",
            },
            constraint: {
                constraint: "限制",
                require: "必填",
                unique: "唯一",
                min: "最小值",
                max: "最大值",
                regex: "格式（正則表達）",
            },
        },
        setting: {
            title: "設定",
            lang: "語言",
            save_before: {
                content: "更新設定前，請先儲存筆記。",
            }
        }
    },
    common: {
        confirm: "確認",
        save_confirm_window: {
            title: "儲存{target}",
            content: "是否儲存變動？",
            save: "儲存",
            cancel: "不儲存",
        },
        create: "新增",
        cancel: "取消",
        add: "新增",
        delete: "刪除",
        error: "錯誤",
        loading: "載入中...",
    },
    symbol: {
        colon: "：",
    },
    error: {
        general: {
            title: "發生錯誤",
            open_note: "開啟筆記失敗。",
            message: "發生錯誤，請檢查程式記錄檔。",
        },
        attribute: {
            invalid_type_conversion: {
                title: "無效的類型轉換",
                message: "無法將資料從{0}類型轉換為{1}類型。"
            },
            null_attr_type: {
                title: "無效的欄目類型",
                message: "欄目類型不可為空。"
            },
            incompatible_constrain: {
                title: "不相容的限制",
                message: "新限制「{0}」與現有限制「{1}」不相容。"
            },
            forbidden_constrain: {
                title: "不允許的限制",
                message: "欄目不允許使用限制「{0}」。"
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
                title: "無效的檔案路徑",
                message: "檔案路徑格式錯誤或不存在此電腦。"
            },
            already_opened: {
                title: "檔案已開啟",
                message: "檔案「{0}」已於某視窗開啟。"
            },
            io: {
                title: "檔案存取錯誤",
                message: "檔案存取錯誤，請檢查程式記錄檔。"
            },
        },
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
