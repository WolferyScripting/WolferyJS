import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { PuppetInfoProperties } from "../generated/models/types.js";
import { PuppetInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface PuppetInfo extends BaseModel, PuppetInfoProperties {}
// do not edit the first line of the class comment
/**
 * The info for a puppet.
 * @resourceID PUPPET_INFO(core.puppet.{id}.info)
 */
class PuppetInfo extends BaseModel implements PuppetInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: PuppetInfoDefinition });
    }
}

export default PuppetInfo;
