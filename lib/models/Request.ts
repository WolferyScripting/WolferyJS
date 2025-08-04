import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RequestProperties } from "../generated/models/types.js";
import { RequestDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Request extends BaseModel, RequestProperties {}
class Request extends BaseModel implements RequestProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RequestDefinition });
    }

    /** Accept this request. */
    async accept(): Promise<null> {
        return this.client.getPlayer().then(player => player.acceptRequest(this.id));
    }

    /** Reject this request. */
    async reject(): Promise<null> {
        return this.client.getPlayer().then(player => player.rejectRequest(this.id));
    }

    /** Revoke this request. */
    async revoke(): Promise<null> {
        return this.client.getPlayer().then(player => player.revokeRequest(this.id));
    }
}

export default Request;
