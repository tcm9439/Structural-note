import _ from "lodash"

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
    static cloneDeepWithCloneable<T>(value_to_clone: T): T {
        return _.cloneDeepWith(value_to_clone, (value) => {
            if (_.isObject(value) && "cloneDeepWithCustomizer" in value && _.isFunction(value.cloneDeepWithCustomizer)) {
                // if the value is a object that implements Cloneable
                return value.cloneDeepWithCustomizer()
            }
        })
    }
}