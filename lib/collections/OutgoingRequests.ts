import BaseCollection from "./BaseCollection.js";
import type Request from "../models/Request.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The outgoing requests for the player.
 * @resourceID {@link ResourceIDs.OUTGOING_REQUESTS | OUTGOING_REQUESTS}
 */
export default class OutgoingRequests extends BaseCollection<Request> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
