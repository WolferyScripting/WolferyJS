import type Note from "./Note.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Commands from "../util/commands.js";
import { type ResClient, ResRef } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * All notes.
 * @resourceID {@link ResourceIDs.NOTES | NOTES}
 */
class Notes extends BaseCollectionModel<ResRef<Note>, typeof ResourceIDs.NOTE> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof ResRef, {
            ridConstructor: ResourceIDs.NOTE
        });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("notes"));
    }

    get playerId(): string {
        return ResourceIDs.NOTES.parts(this.rid).id;
    }

    /**
     * Create a note for a character.
     * @param charId The ID of the character.
     * @param options The options for the note.
     * @playerRequired
     * @calls {@link PlayerCommands.setNote} > {@link fetch}
     */
    async create(charId: string, options: Commands.Player.SetNoteOptions): Promise<Note> {
        return this.client.commands.player.setNote(this.playerId, charId, options)
            .then(() => this.fetch(this.playerId, charId));
    }

    /**
     * Get all notes.
     * @calls {@link ResRef.get}
     */
    async fetchAll(): Promise<Array<Note>> {
        return Promise.all(this.list.map(ref => ref.get()));
    }
}

export default Notes;
