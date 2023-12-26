import { Constraint, ConstraintType } from "./Constraint.js"
import { RequireConstraint } from "./RequireConstraint.js"
import { MinConstraint } from "./MinConstraint.js"
import { MaxConstraint } from "./MaxConstraint.js"

export const ConstraintTypeToClassMap = new Map<ConstraintType, { new(): Constraint }>([
    [ConstraintType.REQUIRE, RequireConstraint],
    [ConstraintType.MIN, MinConstraint],
    [ConstraintType.MAX, MaxConstraint]
])