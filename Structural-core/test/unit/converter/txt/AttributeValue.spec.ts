import { describe, it, expect, beforeAll } from "vitest"
import { AttributeValueTxtConverter } from "@/converter/txt/AttributeValue.js"
import { AttributeValue, ModuleInit, AttributeDefinition, BooleanAttribute, IntegerAttribute, DecimalAttribute, MarkdownAttribute, ConstraintType, EnumConstraint, EnumAttribute, ShortStringAttribute } from '@/index.js'


describe("AttributeValueTxtConverter", () => {
    let converter = new AttributeValueTxtConverter()
    beforeAll(async () => {
        await ModuleInit.init()
    })

    it("convert", () => {
        let attr_def: AttributeDefinition<any> = new AttributeDefinition("test", new ShortStringAttribute())
        let value = new AttributeValue(attr_def, "test")
        expect(converter.convert(attr_def, value)).toBe("test: test")

        attr_def = new AttributeDefinition("test", new BooleanAttribute())
        value = new AttributeValue(attr_def, true)
        expect(converter.convert(attr_def, value)).toBe("test: true")

        attr_def = new AttributeDefinition("test", new IntegerAttribute())
        value = new AttributeValue(attr_def, 42)
        expect(converter.convert(attr_def, value)).toBe("test: 42")

        // null value
        attr_def = new AttributeDefinition("test", new IntegerAttribute())
        value = new AttributeValue(attr_def)
        expect(converter.convert(attr_def, value)).toBe("")

        attr_def = new AttributeDefinition("test", new DecimalAttribute())
        value = new AttributeValue(attr_def, 42.42)
        expect(converter.convert(attr_def, value)).toBe("test: 42.42")

        attr_def = new AttributeDefinition("test", new MarkdownAttribute())
        value = new AttributeValue(attr_def, "# title\ncontent\n## code section\n`code`")
        expect(converter.convert(attr_def, value)).toBe("test: \n# title\ncontent\n## code section\n`code`")

        attr_def = new AttributeDefinition("test", new EnumAttribute())
        let constraint = attr_def.getConstraint(ConstraintType.ENUM) as EnumConstraint
        constraint.available_values = ["testEnum1", "testEnum2"]
        value = new AttributeValue(attr_def, 0)
        expect(converter.convert(attr_def, value)).toBe("test: testEnum1")
    })
})
