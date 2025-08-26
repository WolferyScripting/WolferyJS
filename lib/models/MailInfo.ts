import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { MailInfoProperties } from "../generated/models/types.js";
import { MailInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface MailInfo extends BaseModel, MailInfoProperties {}
class MailInfo extends BaseModel implements MailInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: MailInfoDefinition });
    }
}

export default MailInfo;
