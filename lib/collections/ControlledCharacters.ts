import BaseCollection from "./BaseCollection.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { CollectionAddRemove } from "../util/types.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type ResClient from "resclient-ts";

export default class ControlledCharacters extends BaseCollection<ControlledCharacter> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<ControlledCharacter>): void {
        this.client.emit("controlledCharacterAdd", data.item);
    }

    private _onRemove(data: CollectionAddRemove<ControlledCharacter>): void {
        this.client.emit("controlledCharacterRemove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}
