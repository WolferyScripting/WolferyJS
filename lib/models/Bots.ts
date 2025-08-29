import Bot from "./Bot.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The authenticated user's bots.
 * @resourceID {@link ResourceIDs.BOTS | BOTS}
 */
class Bots extends BaseCollectionModel<Bot> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof Bot);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("bots"));
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
