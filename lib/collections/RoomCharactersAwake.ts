import BaseCollection from "./BaseCollection.js";
import type { CollectionAddRemove } from "../util/types.js";
import type Character from "../models/Character.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type ResClient from "resclient-ts";

export default class RoomCharactersAwake extends BaseCollection<Character> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<Character>): void {
        this.client.emit("roomCharacterAddAwake", data.item);
    }

    private _onRemove(data: CollectionAddRemove<Character>): void {
        this.client.emit("roomCharacterRemoveAwake", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}
