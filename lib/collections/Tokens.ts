import BaseCollection from "./BaseCollection.js";
import type Token from "../models/Token.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The authenticated user's management tokens.
 * @resourceID {@link ResourceIDs.TOKENS | TOKENS}
 */
class Tokens extends BaseCollection<Token, typeof ResourceIDs.TOKEN> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.TOKEN
        });
    }

    get playerId(): string {
        return ResourceIDs.TOKENS.parts(this.rid).id;
    }

    /**
     * Create a token.
     * @playerRequired
     * @calls {@link PlayerCommands.createToken}
     */
    async create(): Promise<Token> {
        return this.client.commands.player.createToken(this.playerId);
    }
}

export default Tokens;
