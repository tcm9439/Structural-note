import { UUID } from "@/common/CommonTypes"
import { v4 as uuidv4 } from 'uuid';

export abstract class ComponentBase {
    private readonly _id: UUID

    constructor() {
        this._id = ComponentBase.generateNewId()
    }

    get id(): UUID {
        return this._id
    }

    public static generateNewId(): UUID {
        return uuidv4()
    }
}
