import BaseCollection from "./BaseCollection.js";
import type PlayerMailMessage from "../models/PlayerMailMessage.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type Character from "../models/Character.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Player from "../models/Player.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The player's mail inbox.
 * @resourceID {@link ResourceIDs.INBOX | INBOX}
 */
class Inbox extends BaseCollection<PlayerMailMessage, typeof ResourceIDs.PLAYER_MAIL_MESSAGE> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.PLAYER_MAIL_MESSAGE
        });
    }

    get playerId(): string {
        return ResourceIDs.INBOX.parts(this.rid).id;
    }

    /**
     * Get the player this inbox is for.
     * @calls {@link CoreCommands.getPlayer}
     */
    async getPlayer(): Promise<Player> {
        const player = await this.client.commands.core.getPlayer();
        if (player.id !== this.playerId) {
            throw new Error(`Authenticated player id ${player.id} does not match collection player id ${this.playerId}`);
        }
        return player;
    }

    /**
     * Send a mail to a character.
     * @param fromCharId The ID of the character sending the mail.
     * @param toCharId The ID of the character to send the mail to.
     * @param options The options for the mail.
     * @playerRequired
     * @calls {@link PlayerCommands.mail} > {@link WolferyJS.getChar}
     */
    async send(fromCharId: string, toCharId: string, options: Commands.Inbox.SendOptions): Promise<Character> {
        return this.client.commands.player.mail(this.playerId, fromCharId, toCharId, options)
            .then(r => this.client.getChar(r.id));
    }
}

export default Inbox;
