import BaseCollection from "./BaseCollection.js";
import type Puppet from "../models/Puppet.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

export default class Puppets extends BaseCollection<Puppet> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<Puppet>): void {
        this.client.emit("puppets.add", data.item.char, data.item);
    }

    private _onRemove(data: CollectionAddRemove<Puppet>): void {
        this.client.emit("puppets.remove", data.item.char, data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}
