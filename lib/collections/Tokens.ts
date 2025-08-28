import BaseCollection from "./BaseCollection.js";
import type Token from "../models/Token.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The authenticated user's management tokens.
 * @resourceID {@link ResourceIDs.TOKENS | TOKENS}
 */
class Tokens extends BaseCollection<Token> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid);
    }

    /** Create a token. */
    async create(): Promise<Token> {
        return this.call<Token>("create");
    }
}

export default Tokens;
