export class ArrayUtil {
    /**
     * Return a list of elements list.
     * The elements provided will be grouped into sub-lists of the specified length.
     */
    static group<T>(array_to_group: T[], element_in_group: number, padded_with?: any): T[][]{        
        let result:T[][] = []
        let current_group: T[] = []
        for (let element of array_to_group) {
            current_group.push(element)
            if (current_group.length === element_in_group) {
                result.push(current_group)
                current_group = []
            }
        }
        // add the last group if it is not empty
        if (current_group.length > 0) {
            // padded the group if length < element_in_group && padded_with is defined
            if (padded_with !== undefined) {
                while (current_group.length < element_in_group) {
                    current_group.push(padded_with)
                }
            }
            result.push(current_group)
        }
        return result
    }
}