import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { AreaDetailsProperties } from "../generated/models/types.js";
import { AreaDetailsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface AreaDetails extends BaseModel, AreaDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A detailed area, seen by a controlled character.
 */
class AreaDetails extends BaseModel implements AreaDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: AreaDetailsDefinition });
    }
}

export default AreaDetails;
