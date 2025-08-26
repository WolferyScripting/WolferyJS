import BaseModel from "./BaseModel.js";
import type RoomScriptDetails from "./RoomScriptDetails.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { RoomScriptProperties } from "../generated/models/types.js";
import { RoomScriptDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomScript extends BaseModel, RoomScriptProperties {}
// do not edit the first line of the class comment
/**
 * A room script.
 */
class RoomScript extends BaseModel implements RoomScriptProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomScriptDefinition });
    }

    async getDetails(): Promise<RoomScriptDetails> {
        return this.api.get<RoomScriptDetails>(ResourceIDs.ROOMSCRIPT_DETAILS({ id: this.id }));
    }
}

export default RoomScript;
