import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { LookAtProperties } from "../generated/models/types.js";
import { LookAtDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface LookAt extends BaseModel, LookAtProperties {}
class LookAt extends BaseModel implements LookAtProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: LookAtDefinition });
    }
}

export default LookAt;
