import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ScriptLogProperties } from "../generated/models/types.js";
import { ScriptLogDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface ScriptLog extends BaseModel, ScriptLogProperties {}
// do not edit the first line of the class comment
/**
 * A log for a room script.
 * @resourceID {@link ResourceIDs.SCRIPT_LOG | SCRIPT_LOG}
 */
class ScriptLog extends BaseModel implements ScriptLogProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ScriptLogDefinition });
    }
}

export default ScriptLog;
