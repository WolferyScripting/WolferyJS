import BaseModel from "./BaseModel.js";
import type OwnedCharacter from "./OwnedCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { WatchProperties } from "../generated/models/types.js";
import { WatchDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Watch extends BaseModel, WatchProperties {}
// do not edit the first line of the class comment
/**
 * A watched character.
 * @resourceID {@link ResourceIDs.WATCH | WATCH}
 */
class Watch extends BaseModel implements WatchProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: WatchDefinition });
    }

    async getWatchedBy(): Promise<Array<OwnedCharacter>> {
        return this.client.modules.core.getPlayer().then(player => this.watchers.map(id => player.chars.getOrThrow(id)));
    }

    // @TODO
    async unwatch(): Promise<void> {
        // return this.client.modules.core.getPlayer().then(player => {});
    }
}

export default Watch;
