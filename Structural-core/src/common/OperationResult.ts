/**
 * Represent the result of an operation (function).
 * Useful for displaying error messages.
 */
export type OperationResult = {
    valid: boolean;
    // TODO change to key
    invalid_message: string;
};

export const ValidOperationResult: OperationResult = {
    valid: true,
    invalid_message: ""
};
