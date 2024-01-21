import { expect } from "vitest"
import { isEqualWith } from "lodash-es"

export function assertEqualExceptLambda(obj_a: any, obj_b: any) {
    expect(isEqualWith(obj_a, obj_b, (objValue, othValue) => {
        if (objValue instanceof Function && othValue instanceof Function) {
            return true
        }
        return objValue.id === othValue.id
    })).toBeTruthy()
}