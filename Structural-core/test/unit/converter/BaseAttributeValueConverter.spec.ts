import { describe, it, expect, beforeAll } from "vitest"
import { BaseAttributeValueConverter } from "@/converter/BaseAttributeValueConverter.js"
import { AttributeValue, ModuleInit, AttributeDefinition, BooleanAttribute, IntegerAttribute, DecimalAttribute, MarkdownAttribute, ConstraintType, EnumConstraint, EnumAttribute } from '@/index.js'
describe("BaseAttributeValueConverter", () => {
    beforeAll(async () => {
        await ModuleInit.init()
    })

    it("fromBoolean", () => {
        let attr_def = new AttributeDefinition("test", new BooleanAttribute())
        let value = new AttributeValue(attr_def, true)
        expect(BaseAttributeValueConverter.fromBoolean(attr_def, value)).toBe("True")

        value = new AttributeValue(attr_def, false)
        expect(BaseAttributeValueConverter.fromBoolean(attr_def, value)).toBe("False")
    })

    it("fromInteger", () => {
        let attr_def = new AttributeDefinition("test", new IntegerAttribute())
        let value = new AttributeValue(attr_def, 42)
        expect(BaseAttributeValueConverter.fromInteger(attr_def, value)).toBe("42")
    })

    it("fromDecimal", () => {
        let attr_def = new AttributeDefinition("test", new DecimalAttribute())
        let value = new AttributeValue(attr_def, 42.42)
        expect(BaseAttributeValueConverter.fromDecimal(attr_def, value)).toBe("42.42")
    })
    
	it("fromMarkdown", () => {
        let attr_def = new AttributeDefinition("test", new MarkdownAttribute())
        let value = new AttributeValue(attr_def, "# title\ncontent\n## code section\n`code`")
        expect(BaseAttributeValueConverter.fromMarkdown(attr_def, value)).toBe("\n#### title\ncontent\n##### code section\n`code`")
	})

    it("fromEnum", () => {
        let attr_def = new AttributeDefinition("test", new EnumAttribute())
        let constraint = attr_def.getConstraint(ConstraintType.ENUM) as EnumConstraint
        constraint.available_values = ["testEnum1", "testEnum2"]
        let value = new AttributeValue(attr_def, 1)
        expect(BaseAttributeValueConverter.fromEnum(attr_def, value)).toBe("testEnum2")
    })
})
