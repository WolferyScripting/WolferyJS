import type Character from "./Character.js";
import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { BasicCharacterResponse } from "../util/types.js";
import type { NoteProperties } from "../generated/models/types.js";
import { NoteDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Note extends BaseModel, NoteProperties {}
class Note extends BaseModel implements NoteProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: NoteDefinition });
    }

    get id(): string {
        return this.rid.slice(this.rid.lastIndexOf(".") + 1);
    }

    /**
     * Append text to the note for this character. The text will be added on a new line.
     * @param text The text to append to the note.
     */
    async appendText(text: string): Promise<Character> {
        return this.client.getPlayer().then(player => player.appendNote(this.id, text));
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

    /**
     * Set the note for this character.
     * @param text The text to set the note to. Provide an empty string to clear.
     */
    async setText(text: string): Promise<Character| null> {
        return this.client.getPlayer().then(player => player.setNote(this.id, text));
    }
}

export default Note;
