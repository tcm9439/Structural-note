import { describe, it, expect, beforeAll } from "vitest"
import { ModuleInit } from "@/index.js"
import { AttributeValueMarkdownConverter } from "@/converter/markdown/AttributeValue.js"
import { AttributeValue } from "@/note/element/structural/attribute/value/AttributeValue.js"
import { AttributeDefinition } from "@/note/element/structural/attribute/AttributeDefinition.js"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"
import { BooleanAttribute } from "@/note/element/structural/attribute/type/BooleanAttribute.js"
import { IntegerAttribute, DecimalAttribute } from "@/note/element/structural/attribute/type/NumberAttribute.js"
import { MarkdownAttribute } from "@/note/element/structural/attribute/type/MarkdownAttribute.js"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain.js"

describe("AttributeValueMarkdownConverter", () => {
    beforeAll(() => {
        ModuleInit.init()
    })

    it("convert", () => {
        let attr_def: AttributeDefinition<any> = new AttributeDefinition("test", new StringAttribute())
        let value = new AttributeValue(attr_def, "test")
        expect(AttributeValueMarkdownConverter.convert(attr_def, value)).toBe("**test**: test")

        attr_def = new AttributeDefinition("test", new BooleanAttribute())
        value = new AttributeValue(attr_def, true)
        expect(AttributeValueMarkdownConverter.convert(attr_def, value)).toBe("**test**: true")

        attr_def = new AttributeDefinition("test", new IntegerAttribute())
        value = new AttributeValue(attr_def, 42)
        expect(AttributeValueMarkdownConverter.convert(attr_def, value)).toBe("**test**: 42")

        // null value
        attr_def = new AttributeDefinition("test", new IntegerAttribute())
        attr_def.addConstrain(new RequireConstrain(false))
        value = new AttributeValue(attr_def)
        expect(AttributeValueMarkdownConverter.convert(attr_def, value)).toBe("")

        attr_def = new AttributeDefinition("test", new DecimalAttribute())
        value = new AttributeValue(attr_def, 42.42)
        expect(AttributeValueMarkdownConverter.convert(attr_def, value)).toBe("**test**: 42.4200")

        attr_def = new AttributeDefinition("test", new MarkdownAttribute())
        value = new AttributeValue(attr_def, "# title\ncontent\n## code section\n`code`")
        expect(AttributeValueMarkdownConverter.convert(attr_def, value)).toBe("**test**: \n#### title\ncontent\n##### code section\n`code`")
    })

    it("fromBoolean", () => {
        let value = new AttributeValue(new AttributeDefinition("test", new BooleanAttribute()), true)
        expect(AttributeValueMarkdownConverter.fromBoolean(value)).toBe("true")
        value = new AttributeValue(new AttributeDefinition("test", new BooleanAttribute()), false)
        expect(AttributeValueMarkdownConverter.fromBoolean(value)).toBe("false")
    })

    it("fromInteger", () => {
        let value = new AttributeValue(new AttributeDefinition("test", new IntegerAttribute()), 42)
        expect(AttributeValueMarkdownConverter.fromInteger(value)).toBe("42")
    })

    it("fromDecimal", () => {
        let value = new AttributeValue(new AttributeDefinition("test", new DecimalAttribute()), 42.42)
        expect(AttributeValueMarkdownConverter.fromDecimal(value)).toBe("42.4200")
    })

	it("fromMarkdown", () => {
        let value = new AttributeValue(new AttributeDefinition("test", new MarkdownAttribute()), "# title\ncontent\n## code section\n`code`")
        expect(AttributeValueMarkdownConverter.fromMarkdown(value)).toBe("\n#### title\ncontent\n##### code section\n`code`")
	})
})
