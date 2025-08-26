import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RequestParamsProperties } from "../generated/models/types.js";
import { RequestParamsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RequestParams extends BaseModel, RequestParamsProperties {}
// do not edit the first line of the class comment
/**
 * The parameters for a request.
 * @resourceID REQUEST_PARAMS(core.request.{id}.params)
 */
class RequestParams extends BaseModel implements RequestParamsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RequestParamsDefinition });
    }
}

export default RequestParams;
