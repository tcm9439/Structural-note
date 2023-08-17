import { describe, it, expect, beforeEach } from "vitest"
import { AttributeDefinition, AttributeType, AttributeValue, NumberAttribute, StringAttribute } from "@/note/element/structural/attribute"
import { InvalidTypeConversionException, InvalidTypeConversionForDataException } from "@/note/element/structural/attribute/exception"

class TestAttribute extends AttributeType<boolean> {
    public static readonly TYPE: string = "TEST"
    private static _instance: TestAttribute

    constructor() {
        super(TestAttribute.TYPE)
        this.addConvertibleType(StringAttribute.TYPE, this.convertToString)
    }

    convertToString(value: boolean, mode?: any): string {
        return String(value)
    }

    static get instance(): TestAttribute {
        if (!this._instance){
            this._instance = new TestAttribute()
        }
        return this._instance
    }

    create(definition: AttributeDefinition, value: boolean): AttributeValue<boolean> {
        return new AttributeValue<boolean>(definition, value)
    }
}

describe('AttributeType', () => {
	it('constructor', () => {
        expect(TestAttribute.instance).not.toBeNull()
    })

	it('type getter', () => {
        expect(TestAttribute.instance.type).toBe("TEST")
    })
	it('convertibleTo getter', () => {
        expect(Array.from(TestAttribute.instance.convertibleTo)).toEqual([StringAttribute.TYPE])
    })

    it('isConvertibleTo', () => {
        expect(TestAttribute.instance.isConvertibleTo("TEST")).toBe(false)
        expect(TestAttribute.instance.isConvertibleTo(NumberAttribute.TYPE)).toBe(false)
        expect(TestAttribute.instance.isConvertibleTo(StringAttribute.TYPE)).toBe(true)
    })

    it('addConvertibleType', () => {
        expect(TestAttribute.instance.isConvertibleTo("TEST2")).toBe(false)
        TestAttribute.instance.addConvertibleType("TEST2", x => x)
        expect(TestAttribute.instance.isConvertibleTo("TEST2")).toBe(true)

        // todo: mode
    })

    it('convertTo', () => {
        const attr_def = new AttributeDefinition("test", StringAttribute.instance)
        const attr_val = TestAttribute.instance.convertTo(true, attr_def)
        expect(attr_val).toBeInstanceOf(AttributeValue)
        expect(attr_val.value).toBe("true")
    })

    it('convertTo - invalid type', () => {
        const attr_def = new AttributeDefinition("test", NumberAttribute.instance)
        expect(() => TestAttribute.instance.convertTo(true, attr_def)).toThrow(InvalidTypeConversionException)
    })
})
