import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { TagInfoProperties } from "../generated/models/types.js";
import { TagInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface TagInfo extends BaseModel, TagInfoProperties {}
// do not edit the first line of the class comment
/**
 * The tag info.
 */
class TagInfo extends BaseModel implements TagInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TagInfoDefinition });
    }
}

export default TagInfo;
