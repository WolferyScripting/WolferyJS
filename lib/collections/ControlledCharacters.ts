import BaseCollection from "./BaseCollection.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The controlled characters.
 */
export default class ControlledCharacters extends BaseCollection<ControlledCharacter> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<ControlledCharacter>): void {
        this.client.emit("controlledCharacters.add", data.item);
    }

    private _onRemove(data: CollectionAddRemove<ControlledCharacter>): void {
        this.client.emit("controlledCharacters.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}
