import BaseCollection from "./BaseCollection.js";
import type Request from "../models/Request.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Player from "../models/Player.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The incoming requests for the player.
 * @resourceID {@link ResourceIDs.INCOMING_REQUESTS | INCOMING_REQUESTS}
 */
export default class IncomingRequests extends BaseCollection<Request, typeof ResourceIDs.REQUEST> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.REQUEST
        });
    }

    get playerId(): string {
        return ResourceIDs.INCOMING_REQUESTS.parts(this.rid).id;
    }

    async getPlayer(): Promise<Player> {
        const player = await this.client.commands.core.getPlayer();
        if (player.id !== this.playerId) {
            throw new Error(`Authenticated player id ${player.id} does not match collection player id ${this.playerId}`);
        }
        return player;
    }
}
