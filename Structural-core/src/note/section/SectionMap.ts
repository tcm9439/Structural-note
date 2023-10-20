import { NoteSection, SectionType } from "@/note/section/NoteSection"
import { StructuralSection } from "@/note/section/StructuralSection"

export const SectionTypeMapper = new Map<SectionType, { new(title?: string): NoteSection }>([
    [SectionType.BASE, NoteSection],
    [SectionType.STRUCT, StructuralSection],
])