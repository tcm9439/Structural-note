import type { BaseTranslation } from '../i18n-types.js'

const en = {
    structural: {
        create_note: "Create note",
        setting: {
            title: "Setting",
            lang: "Language",
        }
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
