import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ScriptBinaryProperties } from "../generated/models/types.js";
import { ScriptBinaryDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface ScriptBinary extends BaseModel, ScriptBinaryProperties {}
// do not edit the first line of the class comment
/**
 * The binary for a room script.
 * @resourceID SCRIPT_BINARY(core.script.{script}.binary.{binary})
 */
class ScriptBinary extends BaseModel implements ScriptBinaryProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ScriptBinaryDefinition });
    }
}

export default ScriptBinary;
