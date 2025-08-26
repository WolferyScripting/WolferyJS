import BaseCollection from "./BaseCollection.js";
import type RoomCharacter from "../models/RoomCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The characters in a room.
 */
export default class RoomCharacters extends BaseCollection<RoomCharacter> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
