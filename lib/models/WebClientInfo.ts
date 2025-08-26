import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { WebClientInfoProperties } from "../generated/models/types.js";
import { WebClientInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface WebClientInfo extends BaseModel, WebClientInfoProperties {}
// do not edit the first line of the class comment
/**
 * The web client info.
 * @resourceID WEB_CLIENT_INFO(web.client.info)
 */
class WebClientInfo extends BaseModel implements WebClientInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: WebClientInfoDefinition });
    }
}

export default WebClientInfo;
