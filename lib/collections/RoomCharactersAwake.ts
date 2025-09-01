import BaseCollection from "./BaseCollection.js";
import type Character from "../models/Character.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The awake characters in a room.
 * @resourceID {@link ResourceIDs.ROOM_CHARACTERS_AWAKE | ROOM_CHARACTERS_AWAKE}
 * @resourceID {@link ResourceIDs.ROOM_INSTANCE_CHARACTERS_AWAKE | ROOM_INSTANCE_CHARACTERS_AWAKE}
 */
export default class RoomCharactersAwake extends BaseCollection<Character, typeof ResourceIDs.ROOM_CHARACTER> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.ROOM_CHARACTER
        });
    }
}
