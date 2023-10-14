import { Constrain, ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain"
import { MinConstrain } from "@/note/element/structural/attribute/constrain/MinConstrain"
import { MaxConstrain } from "@/note/element/structural/attribute/constrain/MaxConstrain"

export const ConstrainTypeToClassMap = new Map<ConstrainType, { new(): Constrain }>([
    [ConstrainType.REQUIRE, RequireConstrain],
    [ConstrainType.MIN, MinConstrain],
    [ConstrainType.MAX, MaxConstrain]
])