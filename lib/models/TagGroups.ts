import BaseCollectionModel from "./BaseCollectionModel.js";
import TagGroup from "./TagGroup.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The tag groups.
 * @resourceID {@link ResourceIDs.TAG_GROUPS | TAG_GROUPS}
 */
class TagGroups extends BaseCollectionModel<TagGroup> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof TagGroup);
    }

    /**
     * Create a tag group.
     * @param options The options to create the tag group with.
     * @adminRoleRequired
     */
    async create(options: Commands.Admin.CreateTagGroupOptions): Promise<TagGroup> {
        return this.client.commands.admin.createTagGroup(options);
    }
}

export default TagGroups;
