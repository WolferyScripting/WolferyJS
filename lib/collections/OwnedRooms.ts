import BaseCollection from "./BaseCollection.js";
import type { CollectionAddRemove } from "../util/types.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type Room from "../models/Room.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type ResClient from "resclient-ts";

export default class OwnedRooms extends BaseCollection<Room> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<Room>): void {
        this.client.emit("ownedRoomAdd", this.ctrl, data.item);
    }

    private _onRemove(data: CollectionAddRemove<Room>): void {
        this.client.emit("ownedRoomRemove", this.ctrl, data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    get ctrl(): ControlledCharacter {
        return this.client.playerOrThrow().controlled.getOrThrow(ResourceIDs.OWNED_ROOMS.parts(this.rid).id);
    }
}
