import { AttributeValueMarkdownConverter } from "./AttributeValue.js"
import { BaseElementConverter } from "../BaseElementConverter.js"

export class ElementMarkdownConverter extends BaseElementConverter {
    constructor(){
        super(new AttributeValueMarkdownConverter())
    }
}