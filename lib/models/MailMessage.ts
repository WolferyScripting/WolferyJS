import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { MailMessageProperties } from "../generated/models/types.js";
import { MailMessageDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface MailMessage extends BaseModel, MailMessageProperties {}
class MailMessage extends BaseModel implements MailMessageProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: MailMessageDefinition });
    }
}

export default MailMessage;
