import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ExitDetailsProperties } from "../generated/models/types.js";
import { ExitDetailsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface ExitDetails extends BaseModel, ExitDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A detailed exit.
 */
class ExitDetails extends BaseModel implements ExitDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ExitDetailsDefinition });
    }
}

export default ExitDetails;
