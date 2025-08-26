import BaseCollection from "./BaseCollection.js";
import type Token from "../models/Token.js";
import type WolferyJS from "../WolferyJS.js";
import type { CollectionAddRemove, ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The authenticated user's management tokens.
 * @resourceID TOKENS(auth.user.{id}.tokens)
 */
class Tokens extends BaseCollection<Token> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid);
    }

    private _onAdd(data: CollectionAddRemove<Token>): void {
        this.client.emit("tokens.add", data.item);
    }

    private _onRemove(data: CollectionAddRemove<Token>): void {
        this.client.emit("tokens.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    /** Create a token. */
    async create(): Promise<Token> {
        return this.call<Token>("create");
    }
}

export default Tokens;
