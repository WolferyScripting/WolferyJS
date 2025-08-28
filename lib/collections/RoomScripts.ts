import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type RoomScript from "../models/RoomScript.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The scripts in a room.
 * @resourceID {@link ResourceIDs.ROOM_SCRIPTS | ROOM_SCRIPTS}
 */
export default class RoomScripts extends BaseCollection<RoomScript> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
