import Base from "./Base.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Character from "../models/Character.js";
import type HiddenExits from "../models/HiddenExits.js";
import type BotUser from "../models/BotUser.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { KeyResponse } from "../util/types.js";
import { modelId } from "../util/Util.js";
import type Commands from "../util/commands.js";
import type CharacterInfo from "../models/CharacterInfo.js";
import type RoomProfiles from "../collections/RoomProfiles.js";
import type RoomScripts from "../collections/RoomScripts.js";
import type Teleporters from "../collections/Teleporters.js";
import type Tenants from "../collections/Tenants.js";

export default class MiscCommands extends Base {
    /**
     * Control the character associated with a {@link BotUser}.
     * @param user The {@link BotUser} instance or ID.
     * @botRequired
     * @calls {@link ResClient.call}
     */
    async controlCharBot(user: string | BotUser): Promise<ControlledCharacter> {
        return this.client.api.call<ControlledCharacter>(ResourceIDs.BOT_USER({ id: modelId(user) }), "controlCharBot");
    }

    /**
     * Delete a bot.
     * @param user The {@link BotUser} instance or user ID.
     * @param charId The ID of the bot to delete.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async deleteBot(user: string  | BotUser, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.BOT({ user: modelId(user), bot: charId }), "delete");
    }

    /**
     * Delete a management token.
     * @param tokenId The ID of the token.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async deleteToken(tokenId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.TOKEN({ id: tokenId }), "delete");
    }

    /**
     * Get a character by id.
     * @param charId The ID of the character.
     * @calls {@link ResClient.get}
     */
    async getChar(charId: string): Promise<Character> {
        return this.client.api.get<Character>(ResourceIDs.CHARACTER({ id: charId }));
    }

    /**
     * Get a character's info.
     * @param charId The ID of the character.
     * @calls {@link ResClient.get}
     */
    async getCharInfo(charId: string): Promise<CharacterInfo> {
        return this.client.api.get<CharacterInfo>(ResourceIDs.CHARACTER_INFO({ id: charId }));
    }

    /**
     * Get the hidden exits in the a room.
     * @param roomId The ID of the room.
     * @roomOwnershipRequired
     * @calls {@link ResClient.get}
     */
    async getHiddenExits(roomId: string): Promise<HiddenExits> {
        return this.client.api.get<HiddenExits>(ResourceIDs.HIDDEN_EXITS({ id: roomId }));
    }

    /**
     * Get the profiles of a room.
     * @param roomId The ID of the room.
     * @roomOwnershipRequired
     * @calls {@link ResClient.get}
     */
    async getRoomProfiles(roomId: string): Promise<RoomProfiles> {
        return this.client.api.get<RoomProfiles>(ResourceIDs.ROOM_PROFILES({ id: roomId }));
    }

    /**
     * Get the scripts of a room.
     * @param roomId The ID of the room.
     * @roomOwnershipRequired
     * @calls {@link ResClient.get}
     */
    async getRoomScripts(roomId: string): Promise<RoomScripts> {
        return this.client.api.get<RoomScripts>(ResourceIDs.ROOM_SCRIPTS({ id: roomId }));
    }

    /**
     * Get the characters that have a teleport registered in a room.
     * @param roomId The ID of the room.
     * @param limit The maximum number of teleporters to return.
     * @param page The page of teleporters to return.
     * @roomOwnershipRequired
     * @calls {@link ResClient.get}
     */
    async getTeleporters(roomId: string, limit?: number, page?: number): Promise<Teleporters> {
        let rid = ResourceIDs.TELEPORTERS({ id: roomId });
        if (limit !== undefined) {
            page ??= 0;
            rid += `?limit=${limit}&offset=${page * limit}`;
        }
        return this.client.api.get<Teleporters>(rid);
    }

    /**
     * Get the characters that have their home registered in a room.
     * @param roomId The ID of the room.
     * @param limit The maximum number of tenants to return.
     * @param page The page of tenants to return.
     * @roomOwnershipRequired
     * @calls {@link ResClient.get}
     */
    async getTenants(roomId: string, limit?: number, page?: number): Promise<Tenants> {
        let rid = ResourceIDs.TENANTS({ id: roomId });
        if (limit !== undefined) {
            page ??= 0;
            rid += `?limit=${limit}&offset=${page * limit}`;
        }
        return this.client.api.get<Tenants>(rid);
    }

    /**
     * Renew a bot's token.
     * @param user The {@link BotUser} instance or user ID.
     * @param charId The ID of the bot to renew the token for.
     * @playerRequired
     * @calls {@link ResClient.call}
     * @note The client attempts to call this but it always returns `system.notImplemented`.
     */
    async renewBot(user: string  | BotUser, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.BOT({ user: modelId(user), bot: charId }), "renewToken");
    }

    /**
     * Renew a management token.
     * @param tokenId The ID of the token.
     * @playerRequired
     * @calls {@link ResClient.call}
     * @note The client attempts to call this but it always returns `system.notImplemented`.
     */
    async renewToken(tokenId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.TOKEN({ id: tokenId }), "renewToken");
    }

    /**
     * Set the attributes of a tag.
     * @param tagId The ID of the tag.
     * @param options The options for setting the tag.
     * @calls {@link ResClient.call}
     */
    async setTag(tagId: string, options: Commands.Misc.SetTagOptions): Promise<KeyResponse> {
        return this.client.api.call<{ tag: KeyResponse; }>(ResourceIDs.TAG({ id: tagId }), "set", options)
            .then(r => r.tag);
    }
}
