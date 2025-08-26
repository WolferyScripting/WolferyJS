import BaseCollectionModel from "./BaseCollectionModel.js";
import Token from "./Token.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The authenticated user's management tokens.
 * @resourceID TOKENS(auth.user.{id}.tokens)
 */
class Tokens extends BaseCollectionModel<Token> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, Token);
    }
}

export default Tokens;
