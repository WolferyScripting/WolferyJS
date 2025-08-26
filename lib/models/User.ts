import BaseModel from "./BaseModel.js";
import type Tokens from "./Tokens.js";
import type WolferyJS from "../WolferyJS.js";
import type { UserProperties } from "../generated/models/types.js";
import { UserDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface User extends BaseModel, UserProperties {}
// do not edit the first line of the class comment
/**
 * The user when logging in with username/password.
 * @resourceID USER(auth.user.{id})
 */
class User extends BaseModel implements UserProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: UserDefinition });
    }

    async getTokens(): Promise<Tokens> {
        return this.api.get<Tokens>(ResourceIDs.TOKENS({ id: this.id }));
    }
}

export default User;
