import type Character from "./Character.js";
import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { BasicCharacterResponse } from "../util/types.js";
import type { NoteProperties } from "../generated/models/types.js";
import { NoteDefinition } from "../generated/models/definitions.js";
import { Properties, type ResClient } from "resclient-ts";

export type OnTextChangeFunction = (note: Note, char: Character, text: string, oldText: string) => void;
declare interface Note extends BaseModel, NoteProperties {}
// do not edit the first line of the class comment
/**
 * A note on a character.
 * @resourceID {@link ResourceIDs.NOTE | NOTE}
 */
class Note extends BaseModel implements NoteProperties {
    private onChange = this._onChange.bind(this);
    private onTextChange!: OnTextChangeFunction | null;
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: NoteDefinition });
        Properties.of(this)
            .readOnly("onChange")
            .writable("onTextChange", null);
    }

    private async _onChange(data: Partial<NoteProperties>): Promise<void> {
        if (data.text !== undefined && this.onTextChange) {
            const char = await this.char.get();
            this.onTextChange(this, char, this.text, data.text);
        }
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        if (this.client.anyTracked("notes")) {
            const m = on ? "resourceOn" : "resourceOff";
            this[m]("change", this.onChange);
        }
    }

    get id(): string {
        return this.rid.slice(this.rid.lastIndexOf(".") + 1);
    }

    /**
     * Append text to the note for this character. The text will be added on a new line.
     * @param text The text to append to the note.
     */
    async appendText(text: string): Promise<Character> {
        return this.client.modules.core.getPlayer().then(player => player.appendNote(this.id, text));
    }

    /**
     * Clear the note for this character.
     */
    async clearText(): Promise<null> {
        await this.setText("");
        return null;
    }

    /**
     * Delete this note.
     */
    async delete(): Promise<Character> {
        return this.call<BasicCharacterResponse<"char">>("delete")
            .then(r => this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.char.id })));
    }

    /** @internal */
    getOnTextChange(): OnTextChangeFunction | null {
        return this.onTextChange;
    }

    /** @internal */
    setOnTextChange(cb: OnTextChangeFunction | null): void {
        if (this.onTextChange !== null && cb !== null) {
            throw new Error(`Attempted to overwrite onTextChange for ${this.rid}`);
        }
        this.onTextChange = cb;
    }

    /**
     * Set the note for this character.
     * @param text The text to set the note to. Provide an empty string to clear.
     */
    async setText(text: string): Promise<Character| null> {
        return this.client.modules.core.getPlayer().then(player => player.setNote(this.id, text));
    }
}

export default Note;
