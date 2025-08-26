import type Note from "./Note.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import { type CollectionModelAddRemove, type ResClient, ResRef } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * All notes.
 */
class Notes extends BaseCollectionModel<ResRef<Note>> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, ResRef);
    }

    private async _onAdd(ref: CollectionModelAddRemove<ResRef<Note>>): Promise<void> {
        const note = await ref.item.get();
        const char = await note.char.get();
        this.client.emit("notes.add", note, char);
    }

    private async _onRemove(ref: CollectionModelAddRemove<ResRef<Note>>): Promise<void> {
        const note = await ref.item.get();
        const char = await note.char.get();
        this.client.emit("notes.remove", note, char);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    async fetchAll(): Promise<Array<Note>> {
        return Promise.all(this.list.map(ref => ref.get()));
    }

    async getAll(): Promise<Array<Note>> {
        return this.client.getAllPaginated<Note>(this.rid);
    }
}

export default Notes;
