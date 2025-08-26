import BaseCollection from "./BaseCollection.js";
import type Node from "../models/Node.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The teleport nodes a character has.
 */
export default class CharacterNodes extends BaseCollection<Node> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private async _onAdd(data: CollectionAddRemove<Node>): Promise<void> {
        const char = await this.getChar();
        this.client.emit("characterNodes.add", char, data.item);
    }

    private async _onRemove(data: CollectionAddRemove<Node>): Promise<void> {
        const char = await this.getChar();
        this.client.emit("characterNodes.remove", char, data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    async getChar(): Promise<OwnedCharacter> {
        const charId = ResourceIDs.CHARACTER_NODES.parts(this.rid).id;
        return this.api.get<OwnedCharacter>(ResourceIDs.OWNED_CHARACTER({ id: charId }));
    }
}
