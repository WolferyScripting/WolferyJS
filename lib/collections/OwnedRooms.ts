import BaseCollection from "./BaseCollection.js";
import type Room from "../models/Room.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The rooms owned by a character.
 * @resourceID {@link ResourceIDs.OWNED_ROOMS | OWNED_ROOMS}
 */
export default class OwnedRooms extends BaseCollection<Room> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
