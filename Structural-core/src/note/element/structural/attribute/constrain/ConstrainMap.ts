import { Constrain, ConstrainType } from "./Constrain.js"
import { RequireConstrain } from "./RequireConstrain.js"
import { MinConstrain } from "./MinConstrain.js"
import { MaxConstrain } from "./MaxConstrain.js"

export const ConstrainTypeToClassMap = new Map<ConstrainType, { new(): Constrain }>([
    [ConstrainType.REQUIRE, RequireConstrain],
    [ConstrainType.MIN, MinConstrain],
    [ConstrainType.MAX, MaxConstrain]
])