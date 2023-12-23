import { describe, it, expect, beforeAll } from "vitest"
import { NoteMarkdownConverter } from "@/converter/markdown/Note.js"
import { SectionMarkdownConverter } from "@/converter/markdown/Section.js"
import { Note } from "@/note/Note.js"
import { NoteSection } from "@/note/section/NoteSection.js"
import { StructuralSection } from "@/note/section/StructuralSection.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { TextElement } from "@/note/element/TextElement.js"
import { StructuralElement } from "@/note/element/structural/StructuralElement.js"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute.js"
import { MarkdownAttribute } from "@/note/element/structural/attribute/type/MarkdownAttribute.js"
import { MarkdownElement } from "@/note/element/MarkdownElement.js"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain.js"

const section1_converter_expected_result = `## Section 1

Content 1
<hr/>

Content 2
<hr/>

### Element

#### test
ABC`

const section2_converter_expected_result = `## Section 2

**Str Attr**: test value 1
**Bool Attr**: true
**Markdown Attr**: 
#### test
**markdown**

##### test 2
ABC
<hr/>

Content 5
<hr/>

**Str Attr**: test value 2`

const note_converter_expected_result = `# Converter Test

## Section 1

Content 1
<hr/>

Content 2
<hr/>

### Element

#### test
ABC

## Section 2

**Str Attr**: test value 1
**Bool Attr**: true
**Markdown Attr**: 
#### test
**markdown**

##### test 2
ABC
<hr/>

Content 5
<hr/>

**Str Attr**: test value 2

## Section 3

Content in section 3
`

describe("Note", () => {
    it("convert", () => {
        // create a complex note
        let note = new Note("Converter Test")
        let section1 = new NoteSection("Section 1")
        note.sections.add(section1)
        let section2 = new StructuralSection("Section 2")
        note.sections.add(section2)
        let section3 = new StructuralSection("Section 3")
        note.sections.add(section3)

        // definition
        let definition = section2.definition
        let str_attr = new AttributeDefinition("Str Attr", StringAttribute.instance)
        str_attr.addConstrain(new RequireConstrain(false))
        definition.attributes.add(str_attr)
        let bool_attr = new AttributeDefinition("Bool Attr", BooleanAttribute.instance)
        bool_attr.addConstrain(new RequireConstrain(false))
        definition.attributes.add(bool_attr)
        let md_attr = new AttributeDefinition("Markdown Attr", MarkdownAttribute.instance)
        md_attr.addConstrain(new RequireConstrain(false))
        definition.attributes.add(md_attr)

        // section 1
        let element1 = new TextElement("Content 1")
        section1.elements.add(element1)
        element1 = new TextElement("Content 2")
        section1.elements.add(element1)
        let element4 = new MarkdownElement("# Element\n\n## test\nABC")
        section1.elements.add(element4)
        
        // section 2
        let element2 = new StructuralElement(section2.definition)
        section2.elements.add(element2)
        element2.setValue(str_attr, new AttributeValue(str_attr, "test value 1"))
        element2.setValue(bool_attr, new AttributeValue(bool_attr, true))
        element2.setValue(md_attr, new AttributeValue(md_attr, "# test\n**markdown**\n\n## test 2\nABC"))
        
        let element5 = new TextElement("Content 5")
        section2.elements.add(element5)
        
        // section 3
        let element3 = new StructuralElement(section2.definition)
        section2.elements.add(element3)
        element3.setValue(str_attr, new AttributeValue(str_attr, "test value 2"))

        let element6 = new TextElement("Content in section 3")
        section3.elements.add(element6)

        // section 1
        let result = SectionMarkdownConverter.convert(section1)
        expect(result).toBe(section1_converter_expected_result)

        // section 2
        result = SectionMarkdownConverter.convert(section2)
        expect(result).toBe(section2_converter_expected_result)
        
        // Note to markdown
        let converter = new NoteMarkdownConverter
        result = converter.convert(note)
        expect(result).toBe(note_converter_expected_result)
	})
})
