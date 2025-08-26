import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { TokenProperties } from "../generated/models/types.js";
import { TokenDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Token extends BaseModel, TokenProperties {}
// do not edit the first line of the class comment
/**
 * A management token.
 * @resourceID TOKEN(auth.token.{id})
 */
class Token extends BaseModel implements TokenProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TokenDefinition });
    }
}

export default Token;
