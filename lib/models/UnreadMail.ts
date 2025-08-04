import type PlayerMailMessage from "./PlayerMailMessage.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { UnreadMailProperties } from "../generated/models/types.js";
import { UnreadMailDefinition } from "../generated/models/definitions.js";
import { type ResClient, ResRef } from "resclient-ts";

declare interface UnreadMail extends BaseCollectionModel<ResRef<PlayerMailMessage>>, UnreadMailProperties {}
class UnreadMail extends BaseCollectionModel<ResRef<PlayerMailMessage>> implements UnreadMailProperties {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, ResRef, { definition: UnreadMailDefinition });
    }

    private async _onAdd(ref: ResRef<PlayerMailMessage>): Promise<void> {
        console.log("add unread mail", ref);
    }

    private async _onRemove(ref: ResRef<PlayerMailMessage>): Promise<void> {
        console.log("remove unread mail", ref);
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
