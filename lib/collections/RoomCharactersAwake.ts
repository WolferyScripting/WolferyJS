import BaseCollection from "./BaseCollection.js";
import type Character from "../models/Character.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The awake characters in a room.
 * @resourceID ROOM_CHARACTERS_AWAKE(core.room.{id}.chars.awake)
 * @resourceID ROOM_INSTANCE_CHARACTERS_AWAKE(core.instance.{instance}.room.{room}.chars.awake)
 */
export default class RoomCharactersAwake extends BaseCollection<Character> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
