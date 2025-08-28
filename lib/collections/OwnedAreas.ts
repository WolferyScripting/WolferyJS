import BaseCollection from "./BaseCollection.js";
import type Area from "../models/Area.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The areas owned by a character.
 * @resourceID {@link ResourceIDs.OWNED_AREAS | OWNED_AREAS}
 */
export default class OwnedAreas extends BaseCollection<Area> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
