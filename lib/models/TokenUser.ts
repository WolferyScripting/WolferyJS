import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { TokenUserProperties } from "../generated/models/types.js";
import { TokenUserDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface TokenUser extends BaseModel, TokenUserProperties {}
// do not edit the first line of the class comment
/**
 * The user when logged in with a management token.
 * @resourceID TOKEN_USER(auth.user.{id}.safe)
 */
class TokenUser extends BaseModel implements TokenUserProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TokenUserDefinition });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("unsubscribe", this.client.onUnsubscribe);
    }
}

export default TokenUser;
