import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { TokenProperties } from "../generated/models/types.js";
import { TokenDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Token extends BaseModel, TokenProperties {}
// do not edit the first line of the class comment
/**
 * A management token.
 * @resourceID {@link ResourceIDs.TOKEN | TOKEN}
 */
class Token extends BaseModel implements TokenProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TokenDefinition });
    }

    /** Delete this token. */
    async delete(): Promise<null> {
        return this.call<null>("delete");
    }

    /**
     * Renew this token.
     * @note The client attempts to call this but it always returns `system.notImplemented`.
     */
    async renew(): Promise<null> {
        return this.call<null>("renewToken");
    }
}

export default Token;
