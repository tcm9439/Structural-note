import { SectionType } from "@structural-note/structural-core"
import { tran } from "~/composables/app/translate"

export type AvailableSection = {
    id: string,
    display_choice: string,
}

export function getAvailableSection(): AvailableSection[]{
    return [
        {
            id: SectionType.BASE,
            display_choice: tran("structural.section.add_text_section")
        },
        {
            id: SectionType.STRUCT,
            display_choice: tran("structural.section.add_struct_section")
        }
    ]
}