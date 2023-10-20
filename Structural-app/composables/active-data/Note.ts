import { SectionType } from "structural-core"

export type AvailableSection = {
    id: string,
    display_choice: string,
}

export function getAvailableSection(): AvailableSection[]{
    return [
        {
            id: SectionType.BASE,
            display_choice: "Add Text Section"
        },
        {
            id: SectionType.STRUCT,
            display_choice: "Add Struct Section"
        }
    ]
}