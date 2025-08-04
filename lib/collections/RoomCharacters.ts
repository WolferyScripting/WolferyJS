import BaseCollection from "./BaseCollection.js";
import type { CollectionAddRemove } from "../util/types.js";
import type RoomCharacter from "../models/RoomCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type ResClient from "resclient-ts";

export default class RoomCharacters extends BaseCollection<RoomCharacter> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<RoomCharacter>): void {
        this.client.emit("roomCharacterAdd", data.item);
    }

    private _onRemove(data: CollectionAddRemove<RoomCharacter>): void {
        this.client.emit("roomCharacterRemove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}
