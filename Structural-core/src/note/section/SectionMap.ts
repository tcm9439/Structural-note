import { NoteSection, SectionType } from "./NoteSection.js"
import { StructuralSection } from "./StructuralSection.js"

export const SectionTypeMapper = new Map<SectionType, { new(title?: string): NoteSection }>([
    [SectionType.BASE, NoteSection],
    [SectionType.STRUCT, StructuralSection],
])