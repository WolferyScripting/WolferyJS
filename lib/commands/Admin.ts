import Base from "./Base.js";
import type Commands from "../util/commands.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type TagGroup from "../models/TagGroup.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type {
    Roles,
    KeyNameResponse,
    NameBasicResponse,
    RealmConfigOverseer,
    KeyResponse,
    CharacterResponse
} from "../util/types.js";
import type OwnedCharacters from "../collections/OwnedCharacters.js";
import type GlobalTag from "../models/GlobalTag.js";
import { modelId } from "../util/Util.js";
import type Player from "../models/Player.js";

export default class AdminCommands extends Base {
    /**
     * Add a role to a player.
     * @param player A {@link Player} instance or ID.
     * @param targetId The ID of the player to add the role to.
     * @param role The role to add to the player.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async addPlayerRole(player: string | Player, targetId: string, role: Roles): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "addPlayerRole", { playerId: targetId, role });
    }

    /**
     * Ban a player.
     * @param player A {@link Player} instance or ID.
     * @param targetId The ID of the player to ban.
     * @param reason The ban reason.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async banPlayer(player: string | Player, targetId: string, reason: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "banPlayer", { playerId: targetId, msg: reason });
    }

    /**
     * Broadcast a message across the entire realm.
     * @param player A {@link Player} instance or ID.
     * @param msg The message to broadcast.
     * @param title The title of the broadcast.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async broadcast(player: string | Player, msg: string, title = ""): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "broadcast", { msg, title });
    }

    /**
     * @param options The options for creating the global tag.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async createGlobalTag(options: Commands.Admin.CreateGlobalTagOptions): Promise<GlobalTag> {
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/admin/adminCommands/createGlobalTag/CreateGlobalTag.js#L57-L58
        options.group ||= null;
        options.desc ||= null;
        return this.client.api.call<GlobalTag>(ResourceIDs.TAGS, "create", options);
    }

    /**
     * Create a tag group.
     * @param options The options for creating the tag group.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async createTagGroup(options: Commands.Admin.CreateTagGroupOptions): Promise<TagGroup> {
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/admin/adminCommands/createTagGroup/CreateTagGroup.js#L53-L54
        options.name ||= "";
        options.order ||= 0;
        return this.client.api.call<TagGroup>(ResourceIDs.TAG_GROUPS, "create", options);
    }

    /**
     * Create a global teleport node.
     * @param ctrl The controlled character to create the teleport node with.
     * @param key The key for the node.
     * @adminRoleRequired
     * @calls {@link ControlledCharacter.call}
     */
    async createTeleport(ctrl: ControlledCharacter, key: string): Promise<{ node: KeyResponse; room: NameBasicResponse; }> {
        // the client doesn't allow a room input, not sure if one aside from the current room is allowed?
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/admin/adminCommands/createTeleport/CreateTeleport.js#L37
        // assuming node is returned because if not getting the node for responses would be hell, only room is seen in the client code
        return ctrl.call<{ node: KeyResponse; room: NameBasicResponse; }>("createTeleport", { key, roomId: ctrl.inRoom.id });
    }

    /**
     * Delete a global tag.
     * @param tagId The id of the global tag to delete.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async deleteGlobalTag(tagId: string): Promise<KeyResponse> {
        // id response assumed, only key is known
        return this.client.api.call<{ tag: KeyResponse; }>(ResourceIDs.TAG({ id: tagId }), "delete")
            .then(r => r.tag);
    }

    /**
     * Delete a tag group.
     * @param key The key of the tag group to delete.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async deleteTagGroup(key: string): Promise<KeyNameResponse> {
        return this.client.api.call<{ tagGroup: KeyNameResponse; }>(ResourceIDs.TAG_GROUP({ id: key }), "delete")
            .then(r => r.tagGroup);
    }

    /**
     * Delete a global teleport node.
     * @param ctrl The character to delete the global teleport node with.
     * @param nodeId The ID of the node to delete.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async deleteTeleport(ctrl: string | ControlledCharacter, nodeId: string): Promise<NameBasicResponse> {
        return this.client.api.call<{ room: NameBasicResponse; }>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "deleteTeleport", { nodeId })
            .then(r => r.room);
    }

    /**
     * Get the realm's config.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async getConfig(): Promise<RealmConfigOverseer> {
        return this.client.api.call("core", "getConfig");
    }

    /**
     * Get the characters owned by a player.
     * @param playerId The ID of the player to get the owned characters of.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async getPlayerChars(playerId: string): Promise<OwnedCharacters> {
        return this.client.api.get<OwnedCharacters>(ResourceIDs.OWNED_CHARACTERS({ id: playerId }));
    }

    /**
     * Get a user by a character they own.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of a character the user owns.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async getUser(player: string | Player, charId: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "getUser", { charId });
    }

    // I figured this would be overseer only, but the command I first saw it used in (ban player) claims it to be usable by admins
    // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/moderator/moderatorCommands/banPlayer/BanPlayer.js#L17
    /**
     * Get a user by their username.
     * @param username The username.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async getUserByUsername(username: string): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "getUserByUsername", { username });
    }

    /**
     * Remove a role from a player.
     * @param player A {@link Player} instance or ID.
     * @param targetId The ID of the player to remove the role from.
     * @param role The role to remove from the player.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async removePlayerRole(player: string | Player, targetId: string, role: Roles): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "removePlayerRole", { playerId: targetId, role });
    }

    /**
     * Set the attributes of another character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to set the attributes for.
     * @param options The attributes to set.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async setChar(player: string | Player, charId: string, options: Commands.Admin.SetCharOptions): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.PLAYER({ id: modelId(player) }), "setChar", { charId, ...options })
            .then(r => r.char);
    }

    /**
     * Set the realm config.
     * @param player A {@link Player} instance or ID.
     * @param options The options to set.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async setConfig(player: string | Player, options: Commands.Admin.SetConfigOptions): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "setConfig", options);
    }

    /**
     * Set attributes for a global tag.
     * @param tagId The ID of the global tag to set attributes for.
     * @param options The attributes to set.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async setGlobalTag(tagId: string, options: Commands.Admin.SetGlobalTagOptions): Promise<KeyResponse> {
        return this.client.api.call<{ tag: KeyResponse; }>(ResourceIDs.TAG({ id: tagId }), "set", options)
            .then(r => r.tag);
    }

    // While the code doesn't mention needing admin, player ids seem like they should need admin
    /**
     * Set attributes about a player.
     * @param player A {@link Player} instance or ID.
     * @param targetId The ID of the player to set the attributes for.
     * @param options The attributes to set.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async setPlayer(player: string | Player, targetId: string, options: Commands.Moderator.SetPlayerOptions): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "setPlayer", { playerId: targetId, ...options });
    }

    /**
     * Set attributes for a tag group.
     * @param key The ID of the tag group to set attributes for.
     * @param options The attributes to set.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async setTagGroup(key: string, options: Commands.Admin.SetTagGroupOptions): Promise<KeyNameResponse> {
        return this.client.api.call<{ group: KeyNameResponse; }>(ResourceIDs.TAG_GROUP({ id: key }), "set", options)
            .then(r => r.group);
    }

    /**
     * Unban a player.
     * @param player A {@link Player} instance or ID.
     * @param targetId The ID of the player to unban.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async unbanPlayer(player: string | Player, targetId: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "unbanPlayer", { playerId: targetId });
    }

    /**
     * Find where a character is.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to find.
     * @adminRoleRequired
     * @calls {@link ResClient.call}
     */
    async whereis(player: string | Player, charId: string): Promise<{ char: CharacterResponse; room: NameBasicResponse; }> {
        return this.client.api.call<{ char: CharacterResponse; room: NameBasicResponse; }>(ResourceIDs.PLAYER({ id: modelId(player) }), "whereis", { charId });
    }
}
