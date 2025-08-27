import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { CoreInfoProperties } from "../generated/models/types.js";
import { CoreInfoDefinition } from "../generated/models/definitions.js";
import { type Messages } from "../util/types.js";
import type { ResClient } from "resclient-ts";

declare interface CoreInfo extends BaseModel, CoreInfoProperties {}
// do not edit the first line of the class comment
/**
 * The core info about the realm.
 * @resourceID {@link ResourceIDs.CORE_INFO | CORE_INFO}
 */
class CoreInfo extends BaseModel implements CoreInfoProperties {
    private onOut = this._onOut.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: CoreInfoDefinition });
    }

    private async _onOut(data: Messages.Broadcast): Promise<void> {
        this.client.emit("broadcast", data);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";

        if (this.client.options.track.broadcast) {
            this[m]("out", this.onOut);
        }
    }
}

export default CoreInfo;
