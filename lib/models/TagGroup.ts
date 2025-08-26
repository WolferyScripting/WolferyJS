import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { TagGroupProperties } from "../generated/models/types.js";
import { TagGroupDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface TagGroup extends BaseModel, TagGroupProperties {}
// do not edit the first line of the class comment
/**
 * A tag group.
 * @resourceID TAG_GROUP(tag.groups.{id})
 */
class TagGroup extends BaseModel implements TagGroupProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TagGroupDefinition });
    }
}

export default TagGroup;
