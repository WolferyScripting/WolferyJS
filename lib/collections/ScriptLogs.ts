import BaseCollection from "./BaseCollection.js";
import type ScriptLog from "../models/ScriptLog.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The logs for a room script.
 * @resourceID SCRIPT_LOGS(core.script.{id}.logs)
 */
export default class ScriptLogs extends BaseCollection<ScriptLog> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
