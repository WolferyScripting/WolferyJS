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

    async create(charId: string, options: Commands.Player.SetNoteOptions): Promise<Note> {
        const playerId = ResourceIDs.NOTES.parts(this.rid).id;
        await this.client.commands.core.getPlayer().then(player => player.setNote(charId, options));
        return this.fetch(playerId, charId);
    }

    async fetchAll(): Promise<Array<Note>> {
        return Promise.all(this.list.map(ref => ref.get()));
    }

    async getAll(): Promise<Array<Note>> {
        return this.client.getAllPaginated<Note>(this.rid);
    }
}

export default Notes;
