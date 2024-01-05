import { TranslatableText, Note } from "structural-core"
import tutorial_template from "@/assets/template/tutorial.structnote?raw"
import testImgUrl from './assets/template/tutorial.png'


export type NoteTemplate = {
    id: string,
    label: TranslatableText,
    file_content: string,
    image_path: string,
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
    {
        id: "blank",
        label: TranslatableText.new("structural.template.blank"),
        file_content: "",
        image_path: new URL('assets/template/blank.png', import.meta.url).href
        // image_path: new URL('assets/template/blank.png', import.meta.url).href
    },
    {
        id: "tutorial",
        label: TranslatableText.new("structural.template.tutorial"),
        file_content: tutorial_template,
        image_path: testImgUrl
    },
]