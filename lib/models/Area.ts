import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { AreaProperties } from "../generated/models/types.js";
import { AreaDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Area extends BaseModel, AreaProperties {}
// do not edit the first line of the class comment
/**
 * An area.
 * @resourceID {@link ResourceIDs.AREA | AREA}
 */
class Area extends BaseModel implements AreaProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: AreaDefinition });
    }
}

export default Area;
