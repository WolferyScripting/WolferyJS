import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomScriptDetailsProperties } from "../generated/models/types.js";
import { RoomScriptDetailsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomScriptDetails extends BaseModel, RoomScriptDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A detailed room script.
 * @resourceID {@link ResourceIDs.ROOMSCRIPT_DETAILS | ROOMSCRIPT_DETAILS}
 */
class RoomScriptDetails extends BaseModel implements RoomScriptDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomScriptDetailsDefinition });
    }
}

export default RoomScriptDetails;
