import type Note from "./Note.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import { type ResClient, ResRef } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * All notes.
 * @resourceID {@link ResourceIDs.NOTES | NOTES}
 */
class Notes extends BaseCollectionModel<ResRef<Note>> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof ResRef);
    }

    async fetchAll(): Promise<Array<Note>> {
        return Promise.all(this.list.map(ref => ref.get()));
    }

    async getAll(): Promise<Array<Note>> {
        return this.client.getAllPaginated<Note>(this.rid);
    }
}

export default Notes;
