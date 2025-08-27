import BaseCollection from "./BaseCollection.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Room from "../models/Room.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type Character from "../models/Character.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The rooms owned by a character.
 * @resourceID OWNED_ROOMS(core.char.{id}.rooms)
 */
export default class OwnedRooms extends BaseCollection<Room> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private async _onAdd(data: CollectionAddRemove<Room>): Promise<void> {
        const char = await this.getChar();
        const ownedChar = await this.getOwnedChar();
        if (ownedChar) this.client.emit("ownedRooms.add", ownedChar, data.item);
        this.client.emit("rooms.add", char, data.item);
    }

    private async _onRemove(data: CollectionAddRemove<Room>): Promise<void> {
        const char = await this.getChar();
        const ownedChar = await this.getOwnedChar();
        if (ownedChar) this.client.emit("ownedRooms.remove", ownedChar, data.item);
        this.client.emit("rooms.remove", char, data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    async getChar(): Promise<Character> {
        const charId = ResourceIDs.OWNED_ROOMS.parts(this.rid).id;
        return this.api.get<Character>(ResourceIDs.CHARACTER({ id: charId }));
    }

    async getOwnedChar(): Promise<OwnedCharacter | null> {
        const charId = ResourceIDs.OWNED_ROOMS.parts(this.rid).id;
        if (!await this.client.isCharacterOursControlled(charId)) return null;
        return this.api.get<OwnedCharacter>(ResourceIDs.OWNED_CHARACTER({ id: charId }));
    }
}
