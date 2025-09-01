import BaseCollectionModel from "./BaseCollectionModel.js";
import GlobalTag from "./GlobalTag.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The globally available tags.
 * @resourceID {@link ResourceIDs.TAGS | TAGS}
 */
class Tags extends BaseCollectionModel<GlobalTag, typeof ResourceIDs.TAG> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof GlobalTag, {
            ridConstructor: ResourceIDs.TAG
        });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("globalTags"));
    }

    /**
     * Create a new global tag.
     * @param options The options for creating the global tag.
     * @adminRoleRequired
     * @calls {@link AdminCommands.createGlobalTag}
     */
    async create(options: Commands.Admin.CreateGlobalTagOptions): Promise<GlobalTag> {
        return this.client.commands.admin.createGlobalTag(options);
    }
}

export default Tags;
