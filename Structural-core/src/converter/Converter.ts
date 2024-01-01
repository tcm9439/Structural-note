/**
 * An class that accept an element of type E and convert it to a result of type R.
 */
export abstract class Converter<E, R>{
    abstract convert(element: E): R
}

export enum ConverterType {
    MARKDOWN,
    TEXT,
}