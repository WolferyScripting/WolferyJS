import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { AreaChildProperties } from "../generated/models/types.js";
import { AreaChildDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface AreaChild extends BaseModel, AreaChildProperties {}
// do not edit the first line of the class comment
/**
 * A child of an area.
 */
class AreaChild extends BaseModel implements AreaChildProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: AreaChildDefinition });
    }
}

export default AreaChild;
