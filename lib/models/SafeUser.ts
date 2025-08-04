import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { SafeUserProperties } from "../generated/models/types.js";
import { SafeUserDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface SafeUser extends BaseModel, SafeUserProperties {}
class SafeUser extends BaseModel implements SafeUserProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: SafeUserDefinition });
    }
}

export default SafeUser;
