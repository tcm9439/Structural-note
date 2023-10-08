import { Constrain, ConstrainType } from "@/note/element/structural/attribute/constrain/Constrain"
import { RequireConstrain } from "@/note/element/structural/attribute/constrain/RequireConstrain"

export const ConstrainTypeToClassMap = new Map<ConstrainType, Constrain>([
    [ConstrainType.REQUIRE, new RequireConstrain()]
])