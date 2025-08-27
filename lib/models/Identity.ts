import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { IdentityProperties } from "../generated/models/types.js";
import { IdentityDefinition } from "../generated/models/definitions.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

declare interface Identity extends BaseModel, IdentityProperties {}
// do not edit the first line of the class comment
/**
 * The logged in player's identity.
 * @resourceID {@link ResourceIDs.IDENTITY | IDENTITY}
 */
class Identity extends BaseModel implements IdentityProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: IdentityDefinition });
    }

    async set(options: Commands.Identity.SetOptions): Promise<null> {
        return this.call<null>("set", options);
    }
}

export default Identity;
