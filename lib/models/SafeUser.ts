import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { SafeUserProperties } from "../generated/models/types.js";
import { SafeUserDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface SafeUser extends BaseModel, SafeUserProperties {}
// do not edit the first line of the class comment
/**
 * The user when logged in with a management token.
 * @resourceID SAFE_USER(auth.user.{id}.safe)
 */
class SafeUser extends BaseModel implements SafeUserProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: SafeUserDefinition });
    }
}

export default SafeUser;
