export type Integer = number
export type Float = number
export type Timestamp = number
export type ID = Integer
export type UUID = string
export type LanguageCode = string

export type NullableString = string | null
export type NullableNumber = number | null
export type NullableBoolean = boolean | null
export type NullableInteger = Integer | null
export type NullableFloat = Float | null
export type NullableTimestamp = Timestamp | null

export type Consumer = () => void
