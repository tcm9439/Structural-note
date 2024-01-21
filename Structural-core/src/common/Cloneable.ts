import { cloneDeepWith, isFunction, isObject } from "lodash-es"

export interface Cloneable<T> {
    /**
     * The function used for deep clone.
     */
    clone(): T

    /**
     * The function used for deep copying the value from other.
     */
    cloneFrom(other: T): void

    /**
     * The function used by lodash cloneDeepWith.
     * If return undefined, the lodash ori function is used.
     */
    cloneDeepWithCustomizer(): T | undefined
}

export type ICloneable = {
    clone: Function,
    cloneFrom: Function,
    cloneDeepWithCustomizer: Function
}

export class CloneUtil {
    /**
     * Clone the value with the Cloneable.cloneDeepWithCustomizer function.
     * If the value is not a object that implements Cloneable, the lodash cloneDeepWith function is used.
     */
    static cloneDeepWithCloneable<T>(value_to_clone: T): T {
        return cloneDeepWith(value_to_clone, (value) => {
            if (isObject(value) && "cloneDeepWithCustomizer" in value && isFunction(value.cloneDeepWithCustomizer)) {
                // if the value is a object that implements Cloneable
                return value.cloneDeepWithCustomizer()
            }
        })
    }
}