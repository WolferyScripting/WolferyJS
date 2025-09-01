import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { TagGroupProperties } from "../generated/models/types.js";
import { TagGroupDefinition } from "../generated/models/definitions.js";
import type { KeyNameResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

declare interface TagGroup extends BaseModel, TagGroupProperties {}
// do not edit the first line of the class comment
/**
 * A tag group.
 * @resourceID {@link ResourceIDs.TAG_GROUP | TAG_GROUP}
 */
class TagGroup extends BaseModel implements TagGroupProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TagGroupDefinition });
    }

    /**
     * Delete this tag group.
     * @adminRoleRequired
     * @calls {@link AdminCommands.deleteTagGroup}
     */
    async delete(): Promise<KeyNameResponse> {
        return this.client.commands.admin.deleteTagGroup(this.key);
    }

    /**
     * Set attributes of this tag group.
     * @param options The options to set.
     * @adminRoleRequired
     * @calls {@link AdminCommands.setTagGroup}
     */
    async set(options: Commands.Admin.SetTagGroupOptions): Promise<KeyNameResponse> {
        return this.client.commands.admin.setTagGroup(this.key, options);
    }
}

export default TagGroup;
