import { UUID } from "@/common/CommonTypes"
import { v4 as uuidv4 } from "uuid"

export abstract class ComponentBase {
    private _id: UUID

    constructor() {
        this._id = ComponentBase.generateNewId()
    }

    protected set id(id: UUID) {
        this._id = id
    }

    get id(): UUID {
        return this._id
    }

    public static generateNewId(): UUID {
        return uuidv4()
    }
}
