import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { AttrTypeHelper, AttrTypeNameAndInstance } from "@/view/vue-helper/AttrTypeHelper"
import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"

describe("AttrTypeHelper", () => {
    beforeAll(() => {
        AttributeTypeInitializer.initialize()
    })

	it("getAllTypes", () => {
        const types = AttrTypeHelper.getAllTypes()
        let found_number = false
        let found_string = false

        for (let type of types) {
            expect(type.name).toBeTypeOf("string")
            expect(type.instance).toBeInstanceOf(AttributeType)
            
            if (type.name === "INT") {
                found_number = true
                expect(type.instance).toBe(IntegerAttribute.instance)
            } else if (type.name === "STRING") {
                found_string = true
                expect(type.instance).toBe(StringAttribute.instance)
            }
        }

        expect(found_number).toBeTruthy()
        expect(found_string).toBeTruthy()
    })

    it("getGroupedTypes grouped_to_length=n", () => {
        for (let n = 2; n <= 5; n++){
            let type_groups = AttrTypeHelper.getGroupedTypes(n)
            for (let i = 0; i < type_groups.length; i++) {
                const group = type_groups[i]
                if (i < type_groups.length - 1) {
                    // if not the last group, the length should be n
                    expect(group.length).toBe(n)
                } else {
                    // if the last group, the length should be <= n
                    expect(group.length).toBeLessThanOrEqual(n)
                }
                for (let type of group) {
                    expect(type).toBeDefined()
                }
            }
        }
    })

    it("getGroupedConvertibleTypes", () => {
        let type = IntegerAttribute.instance
        let type_groups = AttrTypeHelper.getGroupedConvertibleTypes(type, 2)
        expect(type_groups.length).toBe(1)
        expect(type_groups[0].length).toBe(1)
        expect(type_groups[0][0].name).toBe("STRING")
        expect(type_groups[0][0].instance).toBe(StringAttribute.instance)
    })
})
