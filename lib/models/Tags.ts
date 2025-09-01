import BaseCollectionModel from "./BaseCollectionModel.js";
import CustomTag from "./CustomTag.js";
import GlobalTag from "./GlobalTag.js";
import type WolferyJS from "../WolferyJS.js";
import { type Tag } from "../generated/models/types.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The globally available tags.
 * @resourceID {@link ResourceIDs.TAGS | TAGS}
 */
class Tags extends BaseCollectionModel<Tag> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof CustomTag || item instanceof GlobalTag);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("globalTags"));
    }
}

export default Tags;
