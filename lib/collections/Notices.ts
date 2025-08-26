import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type Notice from "../models/Notice.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The notices for the logged in user.
 * @resourceID AUTH_NOTICES(auth.user.{id}.notices)
 * @resourceID IDENTITY_NOTICES(identity.user.{id}.notices)
 */
export default class Notices extends BaseCollection<Notice> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private async _onAdd(data: CollectionAddRemove<Notice>): Promise<void> {
        this.client.emit("notices.add", data.item);
    }

    private async _onRemove(data: CollectionAddRemove<Notice>): Promise<void> {
        this.client.emit("notices.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}
