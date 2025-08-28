import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type CharacterMin from "../models/CharacterMin.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The characters that have a teleport registered in a room.
 * @resourceID {@link ResourceIDs.TELEPORTERS | TELEPORTERS}
 */
export default class Teleporters extends BaseCollection<CharacterMin> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
