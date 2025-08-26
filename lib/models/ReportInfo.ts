import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ReportInfoProperties } from "../generated/models/types.js";
import { ReportInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface ReportInfo extends BaseModel, ReportInfoProperties {}
// do not edit the first line of the class comment
/**
 * The report info.
 */
class ReportInfo extends BaseModel implements ReportInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ReportInfoDefinition });
    }
}

export default ReportInfo;
