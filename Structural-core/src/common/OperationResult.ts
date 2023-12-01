
export type OperationResult = {
    valid: boolean;
    invalid_message: string;
};

export const ValidOperationResult: OperationResult = {
    valid: true,
    invalid_message: ""
};
