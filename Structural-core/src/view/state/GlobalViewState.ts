export class GlobalViewState {
    private _editing_note_name: string = ""
    // private breadcrumb: string[]

	set editing_note_name(value: string ) {
		this._editing_note_name = value;
	}

    get editing_note_name(): string {
        return this._editing_note_name
    }
}