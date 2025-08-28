import Tag from "./Tag.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The globally available tags.
 * @resourceID {@link ResourceIDs.TAGS | TAGS}
 */
class Tags extends BaseCollectionModel<Tag> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof Tag);
    }
}

export default Tags;
