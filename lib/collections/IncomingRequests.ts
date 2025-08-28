import BaseCollection from "./BaseCollection.js";
import type Request from "../models/Request.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The incoming requests for the player.
 * @resourceID {@link ResourceIDs.INCOMING_REQUESTS | INCOMING_REQUESTS}
 */
export default class IncomingRequests extends BaseCollection<Request> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
