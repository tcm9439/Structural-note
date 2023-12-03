import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import { AttributeType } from "@/note/element/structural/attribute/type/AttributeType"
import { IntegerAttribute } from "@/note/element/structural/attribute/type/NumberAttribute"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute"
import { AttributeTypeInitializer } from "@/note/element/structural/attribute/type/AttributeTypeInitializer"
import { InvalidTypeConversionException, InvalidTypeConversionForDataException } from "@/exception/AttributeException"
import { ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain"

class TestAttribute extends AttributeType<number> {
    public static readonly TYPE: string = "TEST"
    public static readonly INVALID_VALUE: number = -999
    private static _instance: TestAttribute

    constructor() {
        super(TestAttribute.TYPE)
        this.addConvertibleType(StringAttribute.TYPE, this.convertToString)
    }

    convertToString(value: number, mode?: any): string {
        if (value === TestAttribute.INVALID_VALUE) {
            throw new InvalidTypeConversionForDataException(this.type, StringAttribute.TYPE, value)
        }
        return String(value)
    }

    static get instance(): TestAttribute {
        if (!this._instance){
            this._instance = new TestAttribute()
        }
        return this._instance
    }
}

describe('AttributeType', () => {
    beforeAll(() => {
        AttributeTypeInitializer.initialize()
    })

	it('constructor', () => {
        expect(TestAttribute.instance).not.toBeNull()
    })

    it("get allTypes", () => {
        const types = AttributeType.getAttrTypes()
        let found_number = false
        let found_string = false

        for (let type of types) {
            expect(type).toBeInstanceOf(AttributeType)
            
            if (type instanceof IntegerAttribute) {
                found_number = true
            } else if (type instanceof StringAttribute) {
                found_string = true
            }
        }

        expect(found_number).toBeTruthy()
        expect(found_string).toBeTruthy()
    })

    it("getAttrType", () => {
        expect(AttributeType.getAttrType("TEST")).toBe(TestAttribute.instance)
    })

	it("get type", () => {
        expect(TestAttribute.instance.type).toBe("TEST")
    })

	it('get convertibleTo', () => {
        expect(Array.from(TestAttribute.instance.convertibleTo)).toEqual([StringAttribute.TYPE])
    })

    it('isConvertibleTo', () => {
        expect(TestAttribute.instance.isConvertibleTo("TEST")).toBe(false)
        expect(TestAttribute.instance.isConvertibleTo(IntegerAttribute.TYPE)).toBe(false)
        expect(TestAttribute.instance.isConvertibleTo(StringAttribute.TYPE)).toBe(true)
    })

    it('addConvertibleType', () => {
        expect(TestAttribute.instance.isConvertibleTo("TEST2")).toBe(false)
        TestAttribute.instance.addConvertibleType("TEST2", x => x)
        expect(TestAttribute.instance.isConvertibleTo("TEST2")).toBe(true)
    })

    it('addConvertibleType of different mode', () => {
        // TODO
    })

    it('convertTo', () => {
        const attr_val = TestAttribute.instance.convertTo(StringAttribute.instance, 111)
        expect(attr_val).toBe("111")
    })

    it('convertTo same type', () => {
        const attr_val = TestAttribute.instance.convertTo(TestAttribute.instance, 111)
        expect(attr_val).toBe(111)
    })

    it('convertTo - invalid type', () => {
        expect(() => TestAttribute.instance.convertTo(IntegerAttribute.instance, 234)).toThrow(InvalidTypeConversionException)
    })

    it('convertTo - invalid value', () => {
        expect(() => 
            TestAttribute.instance.convertTo(StringAttribute.instance, TestAttribute.INVALID_VALUE))
            .toThrow(InvalidTypeConversionForDataException)
    })

    it("clone", () => {
        let clone = TestAttribute.instance.clone()
        expect(clone).toBe(TestAttribute.instance)
    })

    it("cloneFrom", () => {
        expect(() => {
            TestAttribute.instance.cloneFrom(TestAttribute.instance)
        }).toThrow("Method not supported. AttributeType is singleton.")
    })

    it("cloneDeepWithCustomizer", () => {
        let clone = TestAttribute.instance.cloneDeepWithCustomizer()
        expect(clone).toBe(TestAttribute.instance)
    })

    it("Constrain", () => {
        let available_constraints = TestAttribute.instance.available_constraints
        expect(available_constraints).toHaveLength(1)
        expect(available_constraints[0]).toBe(ConstrainType.REQUIRE)
    })

    it("AllowConstrain", () => {
        expect(TestAttribute.instance.allowConstrain(new RequireConstrain())).toBeTruthy()
    })
})
