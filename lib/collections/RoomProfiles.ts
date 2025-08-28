import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type RoomProfile from "../models/RoomProfile.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The profiles in a room.
 * @resourceID {@link ResourceIDs.ROOM_PROFILES | ROOM_PROFILES}
 */
export default class RoomProfiles extends BaseCollection<RoomProfile> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
