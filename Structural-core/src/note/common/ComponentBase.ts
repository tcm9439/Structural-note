import { UUID } from "crypto"

export abstract class ComponentBase {
    private readonly _id: UUID

    constructor() {
        this._id = ComponentBase.generateNewId()
    }

    get id(): UUID {
        return this._id
    }

    public static generateNewId(): UUID {
        return crypto.randomUUID()
    }
}
