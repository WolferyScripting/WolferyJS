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
     * @calls {@link PlayerCommands.appendNote} > {@link WolferyJS.getChar}
     */
    async appendText(text: string): Promise<Character> {
        return this.client.commands.player.appendNote(this.playerId, this.charId, text)
            .then(r => this.client.getChar(r.id));
    }

    /**
     * Clear the note for this character.
     * @playerRequired
     * @calls {@link set}
     */
    async clearText(): Promise<Character> {
        return this.set({ text: "" });
    }

    /**
     * Delete this note.
     * @playerRequired
     * @calls {@link PlayerCommands.deleteNote} > {@link WolferyJS.getChar}
     */
    async delete(): Promise<Character> {
        return this.client.commands.player.deleteNote(this.playerId, this.charId)
            .then(r => this.client.getChar(r.id));
    }

    /** @internal */
    getOnTextChange(): OnTextChangeFunction | null {
        return this.onTextChange;
    }

    /**
     * Set the note for this character.
     * @param options The options to set.
     * @playerRequired
     * @calls {@link PlayerCommands.setNote} > {@link WolferyJS.getChar}
     */
    async set(options: Commands.Player.SetNoteOptions): Promise<Character> {
        return this.client.commands.player.setNote(this.playerId, this.charId, options)
            .then(r => this.client.getChar(r.id));
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
