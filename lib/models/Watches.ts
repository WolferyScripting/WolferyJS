import type Watch from "./Watch.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { WatchesProperties } from "../generated/models/types.js";
import { type ResClient, ResRef } from "resclient-ts";

declare interface Watches extends BaseCollectionModel<ResRef<Watch>>, WatchesProperties {}
// do not edit the first line of the class comment
/**
 * Watched characters.
 * @resourceID {@link ResourceIDs.WATCHES | WATCHES}
 */
class Watches extends BaseCollectionModel<ResRef<Watch>> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof ResRef);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("watches"));
    }
}

export default Watches;
