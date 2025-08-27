import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RequestProperties } from "../generated/models/types.js";
import { RequestDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Request extends BaseModel, RequestProperties {}
// do not edit the first line of the class comment
/**
 * A request for changing ownership of areas and rooms, creating exits, etc.
 * @resourceID REQUEST(core.request.{id})
 */
class Request extends BaseModel implements RequestProperties {
    private onChange = this._onChange.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RequestDefinition });
    }

    private async _onChange(data: Partial<RequestProperties>): Promise<void> {
        if (data.state !== undefined && this.state !== "pending") {
            const incoming = await this.client.modules.core.getPlayer().then(p => p.chars.some(c => c.id === this.to.id));
            this.client.emit(`requests.${incoming ? "incoming" : "outgoing"}.${this.state}`, this);
        }
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("change", this.onChange);
    }

    /** Accept this request. */
    async accept(): Promise<null> {
        return this.client.modules.core.getPlayer().then(player => player.acceptRequest(this.id));
    }

    /** Reject this request. */
    async reject(): Promise<null> {
        return this.client.modules.core.getPlayer().then(player => player.rejectRequest(this.id));
    }

    /** Revoke this request. */
    async revoke(): Promise<null> {
        return this.client.modules.core.getPlayer().then(player => player.revokeRequest(this.id));
    }
}

export default Request;
