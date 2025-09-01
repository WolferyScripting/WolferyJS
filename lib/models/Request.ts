import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RequestProperties } from "../generated/models/types.js";
import { RequestDefinition } from "../generated/models/definitions.js";
import { Properties, type ResClient } from "resclient-ts";

export type OnStateChangeFunction = (request: Request) => void;
declare interface Request extends BaseModel, RequestProperties {}
// do not edit the first line of the class comment
/**
 * A request for changing ownership of areas and rooms, creating exits, etc.
 * @resourceID {@link ResourceIDs.REQUEST | REQUEST}
 */
class Request extends BaseModel implements RequestProperties {
    private onChange = this._onChange.bind(this);
    private onStateChange!: OnStateChangeFunction | null;
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RequestDefinition });
        Properties.of(this)
            .readOnly("onChange")
            .writable("onStateChange", null);
    }

    private async _onChange(data: Partial<RequestProperties>): Promise<void> {
        if (data.state !== undefined) {
            this.onStateChange?.(this);
        }
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("change", this.onChange);
    }

    /** Accept this request. */
    async accept(): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.acceptRequest(this.id));
    }

    /** @internal */
    getOnStateChange(): OnStateChangeFunction | null {
        return this.onStateChange;
    }

    /** Reject this request. */
    async reject(): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.rejectRequest(this.id));
    }

    /** Revoke this request. */
    async revoke(): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.revokeRequest(this.id));
    }

    /** @internal */
    setOnStateChange(cb: OnStateChangeFunction | null): void {
        if (this.onStateChange !== null && cb !== null) {
            throw new Error(`Attempted to overwrite onStateChange for ${this.rid}`);
        }
        this.onStateChange = cb;
    }
}

export default Request;
