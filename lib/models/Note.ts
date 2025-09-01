import type Character from "./Character.js";
import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { NoteProperties } from "../generated/models/types.js";
import { NoteDefinition } from "../generated/models/definitions.js";
import type Commands from "../util/commands.js";
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

    get charId(): string {
        return ResourceIDs.NOTE.parts(this.rid).char;
    }

    get id(): string {
        // no individual id
        return this.charId;
    }

    get playerId(): string {
        return ResourceIDs.NOTE.parts(this.rid).player;
    }

    /**
     * Append text to the note for this character. The text will be added on a new line.
     * @param text The text to append to the note.
     * @playerRequired
     */
    async appendText(text: string): Promise<Character> {
        return this.client.commands.core.getPlayer().then(player => player.appendNote(this.id, text));
    }

    /**
     * Clear the note for this character.
     * @playerRequired
     */
    async clearText(): Promise<Character> {
        return this.set({ text: "" });
    }

    /**
     * Delete this note.
     * @playerRequired
     */
    async delete(): Promise<Character> {
        return this.client.commands.core.getPlayer().then(player => player.deleteNote(this.id));
    }

    /** @internal */
    getOnTextChange(): OnTextChangeFunction | null {
        return this.onTextChange;
    }

    /**
     * Set the note for this character.
     * @param options The options to set.
     * @playerRequired
     */
    async set(options: Commands.Player.SetNoteOptions): Promise<Character> {
        return this.client.commands.core.getPlayer().then(player => player.setNote(this.id, options));
    }

    /** @internal */
    setOnTextChange(cb: OnTextChangeFunction | null): void {
        if (this.onTextChange !== null && cb !== null) {
            throw new Error(`Attempted to overwrite onTextChange for ${this.rid}`);
        }
        this.onTextChange = cb;
    }
}

export default Note;
