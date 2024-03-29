import { describe, it, expect, beforeAll } from "vitest"
import { InvalidTypeConversionForDataException, InvalidTypeConversionException } from '@/exception/AttributeException'
import { ModuleInit } from '@/index'

describe('InvalidTypeConversionForDataException', () => {
    beforeAll(async () => {
        await ModuleInit.init()
    })

	it('constructor', () => {
        const e = new InvalidTypeConversionForDataException("TYPE-A", "TYPE-B", "DATA")
        expect(e.message).toBe("Invalid operation: Cannot convert data \"DATA\" from type TYPE-A to type TYPE-B")
        expect(e.name).toBe("InvalidTypeConversionForDataException")
    })
})

describe('InvalidTypeConversionException', () => {
    beforeAll(async () => {
        await ModuleInit.init()
    })

	it('empty description', () => {
        const e = new InvalidTypeConversionException("TYPE-A", "TYPE-B")
        expect(e.message).toBe("Invalid operation: Cannot convert type TYPE-A to type TYPE-B")
        expect(e.name).toBe("InvalidTypeConversionException")
    })

    it('with description', () => {
        const e = new InvalidTypeConversionException("TYPE-A", "TYPE-B", "DESCRIPTION")
        expect(e.message).toBe("Invalid operation: Cannot convert type TYPE-A to type TYPE-B (DESCRIPTION)")
        expect(e.name).toBe("InvalidTypeConversionException")
    })
})
