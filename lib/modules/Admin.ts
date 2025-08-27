import Base from "./Base.js";
import { type RealmConfigOverseer } from "./Overseer.js";
import type Commands from "../util/commands.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Tag from "../models/Tag.js";
import type TagGroup from "../models/TagGroup.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import { type BasicCharacterResponse, type Roles, type KeyNameResponse, type NameBasicResponse } from "../util/types.js";
import type Room from "../models/Room.js";
import type OwnedCharacters from "../collections/OwnedCharacters.js";
import type Character from "../models/Character.js";

export interface MoveMessages {
    arriveMsg: string;
    leaveMsg: string;
    travelMsg: string;
}
export interface RealmConfig {
    about: string;
    arrivalMsg: string;
    arrivalRoom: unknown;
    dazedMsg: string;
    defaultDoNotDisturbMsg: string;
    defaultHome: unknown;
    deleteCharMsg: string;
    exitTimeoutMsg: string;
    fallAsleepMsg: string;
    genre: string;
    greeting: string;
    notAPuppetMsg: string;
    puppetControlledByOtherMsg: string;
    quietMsg: string;
    recoverFromDazeMsg: string;
    rules: string;
    subgenre: string;
    summon: MoveMessages;
    sweepMsg: string;
    teleport: MoveMessages;
    teleportHome: MoveMessages;
    title: string;
    wakeUpMsg: string;
}
export default class Admin extends Base {
    /**
     * Add a role to a player.
     * @param playerId The ID of the player to add the role to.
     * @param role The role to add to the player.
     * @roleRequired Admin
     */
    async addPlayerRole(playerId: string, role: Roles): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("addPlayerRole", { playerId, role }));
    }

    /**
     * Ban a player.
     * @param playerId The ID of the player to ban.
     * @param reason The ban reason.
     * @roleRequired Admin
     */
    async banPlayer(playerId: string, reason: string): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("banPlayer", { playerId, msg: reason }));
    }

    /**
     * Broadcast a message across the entire realm.
     * @param msg The message to broadcast.
     * @param title The title of the broadcast.
     * @roleRequired Admin
     */
    async broadcast(msg: string, title = ""): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("broadcast", { msg, title }));
    }

    /**
     * Create a global tag.
     * @param options The options for creating the global tag.
     * @roleRequired Admin
     */
    async createGlobalTag(options: Commands.Admin.CreateGlobalTagOptions): Promise<Tag> {
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/admin/adminCommands/createGlobalTag/CreateGlobalTag.js#L57-L58
        options.group ||= null;
        options.desc ||= null;
        return this.client.api.call<Tag>(ResourceIDs.TAGS, "create", options);
    }

    /**
     * Create a tag group.
     * @param options The options for creating the tag group.
     * @roleRequired Admin
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
     * @roleRequired Admin
     */
    async createTeleport(ctrl: ControlledCharacter, key: string): Promise<Room> {
        // the client doesn't allow a room input, not sure if one aside from the current room is allowed?
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/admin/adminCommands/createTeleport/CreateTeleport.js#L37
        return ctrl.call<{ room: NameBasicResponse; }>("createTeleport", { key, roomId: ctrl.inRoom.id })
            .then(r => this.client.api.get<Room>(ResourceIDs.ROOM({ id: r.room.id })));
    }

    /**
     * Delete a tag group.
     * @param key The key of the tag group to delete.
     * @roleRequired Admin
     */
    async deleteGlobalTag(key: string): Promise<KeyNameResponse> {
        return this.client.api.call<{ group: KeyNameResponse; }>(ResourceIDs.TAG_GROUP({ id: key }), "delete")
            .then(r => r.group);
    }

    /**
     * Delete a tag group.
     * @param key The key of the tag group to delete.
     * @roleRequired Admin
     */
    async deleteTagGroup(key: string): Promise<KeyNameResponse> {
        return this.client.api.call<{ tagGroup: KeyNameResponse; }>(ResourceIDs.TAG_GROUP({ id: key }), "delete")
            .then(r => r.tagGroup);
    }

    /**
     * Delete a global teleport node.
     * @param ctrl The character to delete the global teleport node with.
     * @param nodeId The ID of the node to delete.
     * @roleRequired Admin
     */
    async deleteTeleport(ctrl: ControlledCharacter, nodeId: string): Promise<Room> {
        return ctrl.call<{ room: NameBasicResponse; }>("deleteTeleport", { nodeId })
            .then(r => this.client.api.get<Room>(ResourceIDs.ROOM({ id: r.room.id })));
    }

    /**
     * Get the realm's config.
     * @roleRequired Admin
     */
    async getConfig(): Promise<RealmConfigOverseer> {
        return this.client.api.call("core", "getConfig");
    }

    /**
     * Get the characters owned by a player.
     * @param playerId The ID of the player to get the owned characters of.
     * @roleRequired Admin
     */
    async getPlayerChars(playerId: string): Promise<OwnedCharacters> {
        return this.client.api.get<OwnedCharacters>(ResourceIDs.OWNED_CHARACTERS({ id: playerId }));
    }

    /**
     * Get a user by a character they own.
     * @param charId The ID of a character the user owns.
     * @roleRequired Admin
     */
    async getUser(charId: string): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("getUser", { charId }));
    }

    // I figured this would be overseer only, but the command I first saw it used in (ban player) claims it to be usable by admins
    // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/moderator/moderatorCommands/banPlayer/BanPlayer.js#L17
    /**
     * Get a user by their username.
     * @param username The username.
     * @roleRequired Admin
     */
    async getUserByUsername(username: string): Promise<unknown> {
        return this.client.api.call("identity.overseer", "getUserByUsername", { username });
    }

    /**
     * Remove a role from a player.
     * @param playerId The ID of the player to remove the role from.
     * @param role The role to remove from the player.
     * @roleRequired Admin
     */
    async removePlayerRole(playerId: string, role: Roles): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("removePlayerRole", { playerId, role }));
    }

    /**
     * Set the attributes of another character.
     * @param charId The ID of the character to set the attributes for.
     * @param options The attributes to set.
     * @roleRequired Admin
     */
    async setChar(charId: string, options: Commands.Admin.SetCharOptions): Promise<Character> {
        return this.client.modules.core.getPlayer().then(player => player.call<BasicCharacterResponse<"char">>("setChar", { charId, ...options })
            .then(r => player.basicChar(r, "char")));
    }

    /**
     * Set the realm config.
     * @param options The options to set.
     * @roleRequired Admin
     */
    async setConfig(options: Commands.Admin.SetConfigOptions): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("setConfig", options));
    }

    /**
     * Set attributes for a global tag.
     * @param tagId The ID of the global tag to set attributes for.
     * @param options The attributes to set.
     * @roleRequired Admin
     */
    async setGlobalTag(tagId: string, options: Commands.Admin.SetGlobalTagOptions): Promise<KeyNameResponse> {
        return this.client.api.call<{ tag: KeyNameResponse; }>(ResourceIDs.TAG({ id: tagId }), "set", options)
            .then(r => r.tag);
    }

    // While the code doesn't mention needing admin, player ids seem like they should need admin
    /**
     * Set attributes about a player.
     * @param playerId The ID of the player to set the attributes for.
     * @param options The attributes to set.
     * @roleRequired Admin
     */
    async setPlayer(playerId: string, options: Commands.Moderator.SetPlayerOptions): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("setPlayer", { playerId, ...options }));
    }

    /**
     * Set attributes for a tag group.
     * @param key The ID of the tag group to set attributes for.
     * @param options The attributes to set.
     * @roleRequired Admin
     */
    async setTagGroup(key: string, options: Commands.Admin.SetTagGroupOptions): Promise<KeyNameResponse> {
        return this.client.api.call<{ group: KeyNameResponse; }>(ResourceIDs.TAG_GROUP({ id: key }), "set", options)
            .then(r => r.group);
    }

    /**
     * Unban a player.
     * @param playerId The ID of the player to unban.
     * @roleRequired Moderator
     */
    async unbanPlayer(playerId: string): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("unbanPlayer", { playerId }));
    }

    /**
     * Find where a character is.
     * @param charId The ID of the character to find.
     * @roleRequired Admin
     */
    async whereis(charId: string): Promise<{ char: Character; room: Room; }> {
        return this.client.modules.core.getPlayer().then(player => player.call<BasicCharacterResponse<"char"> & { room: NameBasicResponse; }>("whereis", { charId }))
            .then(async r => ({ char: await this.client.api.get<Character>(ResourceIDs.CHARACTER({ id: r.char.id })), room: await this.client.api.get<Room>(ResourceIDs.ROOM({ id: r.room.id })) }));
    }
}
