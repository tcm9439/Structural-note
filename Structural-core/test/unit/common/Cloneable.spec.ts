import { describe, it, expect, beforeEach } from "vitest"
import { CloneUtil } from "@/common/Cloneable.js"
import { StringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"

describe("Cloneable", () => {
    it("Cloneable", () => {
        let clone = StringAttribute.instance.clone()
        expect(clone).toBe(StringAttribute.instance)

        clone = StringAttribute.instance.cloneDeepWithCustomizer()
        expect(clone).toBe(StringAttribute.instance)
    })

    it("cloneDeepWithCloneable AttrType", () => {
        let clone = CloneUtil.cloneDeepWithCloneable(StringAttribute.instance.clone())
        expect(clone).toBe(StringAttribute.instance)
	})
})
