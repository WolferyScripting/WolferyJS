import BaseCollectionModel from "./BaseCollectionModel.js";
import TagGroup from "./TagGroup.js";
import type WolferyJS from "../WolferyJS.js";
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
}

export default TagGroups;
