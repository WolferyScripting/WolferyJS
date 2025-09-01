import BaseCollection from "./BaseCollection.js";
import type ScriptLog from "../models/ScriptLog.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The logs for a room script.
 * @resourceID {@link ResourceIDs.SCRIPT_LOGS | SCRIPT_LOGS}
 */
export default class ScriptLogs extends BaseCollection<ScriptLog, typeof ResourceIDs.SCRIPT_LOG> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.SCRIPT_LOG
        });
    }
}
