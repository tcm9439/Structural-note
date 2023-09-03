import { describe, it, expect, beforeEach } from "vitest"
import { ArrayUtil } from "@/common/ArrayUtil"

describe("ArrayUtil", () => {
    it("group element_in_group=n padded=undefined", () => {
        const array_to_group = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        for (let n = 2; n <= 5; n++){
            let groups = ArrayUtil.group(array_to_group, n)
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i]

                // for all group, the elements should be defined
                for (let element of group) {
                    expect(element).toBeDefined()
                }

                if (i < groups.length - 1) {
                    // if not the last group, the length should be n
                    expect(group.length).toBe(n)
                } else {
                    // if the last group, the length should be <= n
                    expect(group.length).toBeLessThanOrEqual(n)
                }
            }
        }
    })

    it("group element_in_group=n padded=Null", () => {
        const array_to_group = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        for (let n = 2; n <= 5; n++){
            let groups = ArrayUtil.group(array_to_group, n, null)
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i]
                // for all group, the length should be n
                expect(group.length).toBe(n)

                if (i < groups.length - 1) {
                    // if not the last group, all elements should be number
                    for (let element of group) {
                        expect(element).toBeDefined()
                    }
                } else {
                    // if the last group, all elements should be number or null
                    expect(group.length).toBeLessThanOrEqual(n)
                    
                    let number_of_pad = (n - array_to_group.length % n) % n
                    for (let j = 0; j < n - number_of_pad; j++) {
                        expect(group[j]).toBeDefined()
                    }

                    for (let j = n - number_of_pad; j < n; j++) {
                        expect(group[j]).toBeNull()
                    }
                }
            }
        }
    })
})
