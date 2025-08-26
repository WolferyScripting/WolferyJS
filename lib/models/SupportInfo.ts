import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { SupportInfoProperties } from "../generated/models/types.js";
import { SupportInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface SupportInfo extends BaseModel, SupportInfoProperties {}
class SupportInfo extends BaseModel implements SupportInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: SupportInfoDefinition });
    }
}

export default SupportInfo;
