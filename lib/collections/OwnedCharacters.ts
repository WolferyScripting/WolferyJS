import BaseCollection from "./BaseCollection.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The characters owned by the player.
 * @resourceID {@link ResourceIDs.OWNED_CHARACTERS | OWNED_CHARACTERS}
 */
export default class OwnedCharacters extends BaseCollection<OwnedCharacter> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<OwnedCharacter>): void {
        this.client.emit("ownedCharacters.add", data.item);
    }

    private _onRemove(data: CollectionAddRemove<OwnedCharacter>): void {
        this.client.emit("ownedCharacters.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const playerId = ResourceIDs.OWNED_CHARACTERS.parts(this.rid).id;
        if (!await this.client.isPlayerUs(playerId)) return;
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}
