import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { TagProperties } from "../generated/models/types.js";
import { TagDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface CustomTag extends BaseModel, TagProperties {}
// do not edit the first line of the class comment
/**
 * A custom tag.
 * @resourceID {@link ResourceIDs.TAG | TAG}
 */
class CustomTag extends BaseModel implements TagProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TagDefinition });
    }
}

export default CustomTag;
