import BaseCollection from "./BaseCollection.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Area from "../models/Area.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The areas owned by a character.
 */
export default class OwnedAreas extends BaseCollection<Area> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private async _onAdd(data: CollectionAddRemove<Area>): Promise<void> {
        const char = await this.getChar();
        this.client.emit("ownedAreas.add", char, data.item);
    }

    private async _onRemove(data: CollectionAddRemove<Area>): Promise<void> {
        const char = await this.getChar();
        this.client.emit("ownedAreas.remove", char, data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    async getChar(): Promise<OwnedCharacter> {
        const charId = ResourceIDs.OWNED_AREAS.parts(this.rid).id;
        return this.api.get<OwnedCharacter>(ResourceIDs.OWNED_CHARACTER({ id: charId }));
    }
}
