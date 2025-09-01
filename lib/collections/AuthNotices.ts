import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type Notice from "../models/Notice.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Player from "../models/Player.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The auth notices for the logged in user. @TODO unfinished
 * @resourceID {@link ResourceIDs.AUTH_NOTICES | AUTH_NOTICES}
 */
export default class AuthNotices extends BaseCollection<Notice> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    get playerId(): string {
        return ResourceIDs.AUTH_NOTICES.parts(this.rid).id;
    }

    /**
     * Get the player these notices are for.
     * @calls {@link CoreCommands.getPlayer}
     */
    async getPlayer(): Promise<Player> {
        const player = await this.client.commands.core.getPlayer();
        if (player.id !== this.playerId) {
            throw new Error(`Authenticated player id ${player.id} does not match collection player id ${this.playerId}`);
        }
        return player;
    }
}
