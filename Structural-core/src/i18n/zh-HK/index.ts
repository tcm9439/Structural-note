import type { Translation } from "../i18n-types.js"

const zh_HK = {
	structural: {
        create_note: "新增筆記",
        setting: {
            title: "設定",
            lang: "語言",
        }
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
