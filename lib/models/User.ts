import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { UserProperties } from "../generated/models/types.js";
import { UserDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface User extends BaseModel, UserProperties {}
// do not edit the first line of the class comment
/**
 * The user when logging in with username/password.
 */
class User extends BaseModel implements UserProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: UserDefinition });
    }
}

export default User;
