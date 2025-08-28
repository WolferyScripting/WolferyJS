import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type Notice from "../models/Notice.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The identity notices for the logged in user. @TODO unfinished
 * @resourceID {@link ResourceIDs.IDENTITY_NOTICES | IDENTITY_NOTICES}
 */
export default class IdentityNotices extends BaseCollection<Notice> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
