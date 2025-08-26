import type PlayerMailMessage from "./PlayerMailMessage.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import { type CollectionModelAddRemove, type ResClient, ResRef } from "resclient-ts";

// @TODO
// do not edit the first line of the class comment
/**
 * Unread mail.
 */
class UnreadMail extends BaseCollectionModel<ResRef<PlayerMailMessage>> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, ResRef);
    }

    private async _onAdd(data: CollectionModelAddRemove<ResRef<PlayerMailMessage>>): Promise<void> {
        console.log("add unread mail", data);
    }

    private async _onRemove(data: CollectionModelAddRemove<ResRef<PlayerMailMessage>>): Promise<void> {
        console.log("remove unread mail", data);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    async fetchAll(): Promise<void> {
        for (const ref of this.list) {
            await ref.get();
        }
    }
}

export default UnreadMail;
