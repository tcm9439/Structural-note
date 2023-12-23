import { describe, it, expect, beforeEach } from "vitest"
import { StringBuilder } from "@/converter/ConverterHelper.js"

describe("ConverterHelper", () => {
	it("append", () => {
        let builder = new StringBuilder()
        builder.append("abc")
        expect(builder.toString()).toBe("abc")
	})

    it("appendEmptyLine", () => {
        let builder = new StringBuilder()
        builder.append("abc").appendEmptyLine().append("cde").appendEmptyLine()
        expect(builder.toString()).toBe("abc\n\ncde\n")
    })

    it("appendLine", () => {
        let builder = new StringBuilder()
        builder.append("abc").appendLine("cde")
        expect(builder.toString()).toBe("abc\ncde")
    })

    it("appendHorizontalRow", () => {
        let builder = new StringBuilder()
        builder.append("abc").appendHorizontalRow()
        expect(builder.toString()).toBe("abc\n<hr/>")
    })

    it("removeLastRow", () => {
        let builder = new StringBuilder()
        builder.append("abc").appendLine("line2").appendHorizontalRow().removeLastRow()
        expect(builder.toString()).toBe("abc\nline2")
    })
})
