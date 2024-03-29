/**
 * A string util for building string / html / md with line breaks, indentations, etc.
 */
export class StringBuilder {
    private content: string[] = []
    private current_row: string = ""

    append(words: string){
        this.current_row += words
        return this
    }

    appendEmptyLine(){
        this.appendLine("")
        return this
    }

    private pushCurrentRow(){
        if (this.current_row !== ""){
            this.content.push(this.current_row)
            this.current_row = ""
        }
    }

    appendLine(line: string){
        this.pushCurrentRow()
        this.content.push(line)
        return this
    }

    appendHorizontalRow(){
        this.appendLine("<hr/>")
        return this
    }

    removeLastRow(){
        this.content.pop()
        return this
    }

    toString(){
        this.pushCurrentRow()
        return this.content.join("\n")
    }
}

export class ConverterHelper {
    /**
     * Indent markdown header by adding #*level before each header
     * @param content markdown content
     * @param level number of # to add before the header
     * @returns markdown content with #*level added before each header
     */
    static indentMarkdownHeader(content: string, level: number){
        // if there is a line start with #, add #*level before it
        let lines = content.split("\n")
        let result = ""
        for (let line of lines){
            if (line.startsWith("#")){
                result += "#".repeat(level)
            }
            result += line + "\n"
        }
        // keep the last \n
        return result
    }

    static markdown_replacements: [RegExp, string][] = [
        [/\*/g, '\\*'],
        [/#/g, '\\#'],
        [/\//g, '\\/'],
        [/\(/g, '\\('],
        [/\)/g, '\\)'],
        [/\[/g, '\\['],
        [/\]/g, '\\]'],
        [/</g, '&lt;'],
        [/>/g, '&gt;'],
        [/_/g, '\\_'],
        [/`/g, '\\`'],
    ]

    static escapeMarkdown(content: string): string {
        for (let replacement of this.markdown_replacements){
            content = content.replace(replacement[0], replacement[1])
        }
        return content
    }
}