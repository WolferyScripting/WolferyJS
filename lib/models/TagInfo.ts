import BaseModel from "./BaseModel.js";
import type Character from "./Character.js";
import type WolferyJS from "../WolferyJS.js";
import type { TagInfoProperties } from "../generated/models/types.js";
import { TagInfoDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface TagInfo extends BaseModel, TagInfoProperties {}
// do not edit the first line of the class comment
/**
 * The tag info.
 * @resourceID {@link ResourceIDs.TAG_INFO | TAG_INFO}
 */
class TagInfo extends BaseModel implements TagInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TagInfoDefinition });
    }

    get charId(): string {
        return ResourceIDs.CHARACTER_INFO.parts(this.rid).id;
    }

    async getChar(): Promise<Character> {
        return this.client.getChar(this.charId);
    }
}

export default TagInfo;
