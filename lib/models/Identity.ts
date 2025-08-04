import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { IdentityProperties } from "../generated/models/types.js";
import { IdentityDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Identity extends BaseModel, IdentityProperties {}
class Identity extends BaseModel implements IdentityProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: IdentityDefinition });
    }
}

export default Identity;
