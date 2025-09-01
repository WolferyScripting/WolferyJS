import Base from "./Base.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Character from "../models/Character.js";
import type HiddenExits from "../models/HiddenExits.js";
import type BotUser from "../models/BotUser.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { KeyResponse } from "../util/types.js";
import { modelId } from "../util/Util.js";
import type Commands from "../util/commands.js";

export default class MiscCommands extends Base {
    /**
     * Control the character associated with a {@link BotUser}.
     * @param user The {@link BotUser} instance or ID.
     * @botRequired
     */
    async controlCharBot(user: string | BotUser): Promise<ControlledCharacter> {
        return this.client.api.call<ControlledCharacter>(ResourceIDs.BOT_USER({ id: modelId(user) }), "controlCharBot");
    }

    /**
     * Delete a bot.
     * @param user The {@link BotUser} instance or user ID.
     * @param charId The ID of the bot to delete.
     * @playerRequired
     */
    async deleteBot(user: string  | BotUser, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.BOT({ user: modelId(user), bot: charId }), "delete");
    }

    /**
     * Delete a management token.
     * @param tokenId The ID of the token.
     * @playerRequired
     */
    async deleteToken(tokenId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.TOKEN({ id: tokenId }), "delete");
    }

    /**
     * Get a character by id.
     * @param charId The ID of the character.
     */
    async getChar(charId: string): Promise<Character> {
        return this.client.api.get<Character>(ResourceIDs.CHARACTER({ id: charId }));
    }

    /**
     * Get the hidden exits in the a room.
     * @params roomId The ID of the room.
     * @roomOwnershipRequired
     */
    async getHiddenExits(roomId: string): Promise<HiddenExits> {
        return this.client.api.get<HiddenExits>(ResourceIDs.HIDDEN_EXITS({ id: roomId }));
    }

    /**
     * Renew a bot's token.
     * @param user The {@link BotUser} instance or user ID.
     * @param charId The ID of the bot to renew the token for.
     * @playerRequired
     * @note The client attempts to call this but it always returns `system.notImplemented`.
     */
    async renewBot(user: string  | BotUser, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.BOT({ user: modelId(user), bot: charId }), "renewToken");
    }

    /**
     * Renew a management token.
     * @param tokenId The ID of the token.
     * @playerRequired
     * @note The client attempts to call this but it always returns `system.notImplemented`.
     */
    async renewToken(tokenId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.TOKEN({ id: tokenId }), "renewToken");
    }

    /**
     * Set the attributes of a tag.
     * @param tagId The ID of the tag.
     * @param options The options for setting the tag.
     */
    async setTag(tagId: string, options: Commands.Misc.SetTagOptions): Promise<KeyResponse> {
        return this.client.api.call<{ tag: KeyResponse; }>(ResourceIDs.TAG({ id: tagId }), "set", options)
            .then(r => r.tag);
    }
}
