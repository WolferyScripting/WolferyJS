import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { BotProperties } from "../generated/models/types.js";
import { BotDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface Bot extends BaseModel, BotProperties {}
// do not edit the first line of the class comment
/**
 * A bot.
 * @resourceID {@link ResourceIDs.BOT | BOT}
 */
class Bot extends BaseModel implements BotProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: BotDefinition });
    }

    get charId(): string {
        return this.char.id;
    }

    get userId(): string {
        return ResourceIDs.BOT.parts(this.rid).user;
    }

    /**
     * Delete this bot.
     * @playerRequired
     */
    async delete(): Promise<null> {
        return this.client.commands.misc.deleteBot(this.userId, this.charId);
    }

    /**
     * Renew this bot.
     * @playerRequired
     * @note The client attempts to call this but it always returns `system.notImplemented`.
     */
    async renew(): Promise<null> {
        return this.client.commands.misc.renewBot(this.userId, this.charId);
    }
}

export default Bot;
