import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Room from "../models/Room.js";
import type RoomScript from "../models/RoomScript.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";
import assert from "node:assert";

export default class RoomScripts extends BaseCollection<RoomScript> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private async _onAdd(data: CollectionAddRemove<RoomScript>): Promise<void> {
        const char = await this.getChar();
        const room = await this.getRoom();
        this.client.emit("roomScripts.add", char, room, data.item);
    }

    private async _onRemove(data: CollectionAddRemove<RoomScript>): Promise<void> {
        const char = await this.getChar();
        const room = await this.getRoom();
        this.client.emit("roomScripts.remove", char, room, data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    async getChar(): Promise<ControlledCharacter> {
        const roomId = ResourceIDs.ROOM_PROFILES.parts(this.rid).id;
        const char = await this.client.getCharacterInRoom(roomId);
        assert(char, `Failed to get character for room profiles ${this.rid}`);
        return char;
    }

    async getRoom(): Promise<Room> {
        const roomId = ResourceIDs.ROOM_PROFILES.parts(this.rid).id;
        return this.api.get<Room>(ResourceIDs.ROOM({ id: roomId }));
    }
}
