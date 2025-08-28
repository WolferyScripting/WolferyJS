import BaseCollection from "./BaseCollection.js";
import type Exit from "../models/Exit.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type HiddenExits from "../models/HiddenExits.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The exits in a room.
 * @resourceID {@link ResourceIDs.EXITS | EXITS}
 */
export default class Exits extends BaseCollection<Exit> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    /**
     * Get the hidden exits in the same room.
     * @roomOwnershipRequired
     */
    async getHidden(): Promise<HiddenExits> {
        const roomId = ResourceIDs.EXITS.parts(this.rid).id;
        return this.api.get<HiddenExits>(ResourceIDs.HIDDEN_EXITS({ id: roomId }));
    }
}
