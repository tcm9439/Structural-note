import { describe, it, expect, beforeEach } from "vitest"
import { CloneUtil } from "@/common/Cloneable.js"
import { ShortStringAttribute } from "@/note/element/structural/attribute/type/StringAttribute.js"

describe("Cloneable", () => {
    it("Cloneable", () => {
        let clone = ShortStringAttribute.instance.clone()
        expect(clone).toBe(ShortStringAttribute.instance)

        clone = ShortStringAttribute.instance.cloneDeepWithCustomizer()
        expect(clone).toBe(ShortStringAttribute.instance)
    })

    it("cloneDeepWithCloneable AttrType", () => {
        let clone = CloneUtil.cloneDeepWithCloneable(ShortStringAttribute.instance.clone())
        expect(clone).toBe(ShortStringAttribute.instance)
	})
})
