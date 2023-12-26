import { expect } from "vitest"
import _ from "lodash"

export function assertEqualExceptLambda(obj_a: any, obj_b: any) {
    expect(_.isEqualWith(obj_a, obj_b, (objValue, othValue) => {
        if (objValue instanceof Function && othValue instanceof Function) {
            return true
        }
        return objValue.id === othValue.id
    })).toBeTruthy()
}