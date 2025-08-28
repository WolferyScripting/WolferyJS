import BaseCollection from "./BaseCollection.js";
import type PlayerMailMessage from "../models/PlayerMailMessage.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type Character from "../models/Character.js";
import type { BasicCharacterResponse } from "../util/types.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The player's mail inbox.
 * @resourceID {@link ResourceIDs.INBOX | INBOX}
 */
class Inbox extends BaseCollection<PlayerMailMessage> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid);
    }

    async getAll(): Promise<Array<PlayerMailMessage>> {
        return this.client.getAllPaginated<PlayerMailMessage>(this.rid);
    }

    /**
     * Send a mail to a character.
     * @param fromCharId The ID of the character sending the mail.
     * @param toCharId The ID of the character to send the mail to.
     * @param options The options for the mail.
     */
    async send(fromCharId: string, toCharId: string, options: Commands.Inbox.SendOptions): Promise<Character> {
        return this.client.modules.core.getPlayer().then(player =>
            this.call<BasicCharacterResponse<"toChar">>("send", { toCharId, fromCharId, ...options })
                .then(r => player.basicChar(r, "toChar"))
        );
    }
}

export default Inbox;
