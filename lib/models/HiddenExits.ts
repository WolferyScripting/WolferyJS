import BaseCollectionModel from "./BaseCollectionModel.js";
import Exit from "./Exit.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The hidden exits in a room.
 * @resourceID {@link ResourceIDs.HIDDEN_EXITS | HIDDEN_EXITS}
 */
class HiddenExits extends BaseCollectionModel<Exit> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof Exit);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("hiddenExits"));
    }
}

export default HiddenExits;
