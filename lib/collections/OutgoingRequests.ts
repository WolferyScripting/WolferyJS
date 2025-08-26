import BaseCollection from "./BaseCollection.js";
import type Request from "../models/Request.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The outgoing requests for the player.
 * @resourceID OUTGOING_REQUESTS(core.player.{id}.outgoing.requests)
 */
export default class OutgoingRequests extends BaseCollection<Request> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<Request>): void {
        this.client.emit("requests.outgoing.add", data.item);
    }

    private _onRemove(data: CollectionAddRemove<Request>): void {
        this.client.emit("requests.outgoing.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}
