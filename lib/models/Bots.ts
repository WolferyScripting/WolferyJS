import Bot from "./Bot.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { CollectionModelAddRemove, ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The authenticated user's bots.
 * @resourceID {@link ResourceIDs.BOTS | BOTS}
 */
class Bots extends BaseCollectionModel<Bot> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, Bot);
    }

    private _onAdd(data: CollectionModelAddRemove<Bot>): void {
        this.client.emit("bots.add", data.item);
    }

    private _onRemove(data: CollectionModelAddRemove<Bot>): void {
        this.client.emit("bots.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    /**
     * Create a bot token.
     * @param charId The ID of the character the bot is for.
     */
    async create(charId: string): Promise<Bot> {
        return this.call<Bot>("create", { charId });
    }
}

export default Bots;
