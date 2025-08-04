import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { TagProperties } from "../generated/models/types.js";
import { TagDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Tag extends BaseModel, TagProperties {}
class Tag extends BaseModel implements TagProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TagDefinition });
    }
}

export default Tag;
