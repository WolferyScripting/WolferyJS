import Base from "./Base.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Identity from "../models/Identity.js";
import type { UserIp, Titles, CharacterResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import { PublicPepper } from "../util/Constants.js";
import type Player from "../models/Player.js";
import { modelId } from "../util/Util.js";
import { createHash, createHmac } from "node:crypto";

export default class OverseerCommands extends Base {
    /**
     * Add a title to a user.
     * @param userId The ID of the user to add the title to.
     * @param idRole The title to add to the user.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async addUserTitle(userId: string, idRole: Titles): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "addUserIdRole", { userId, idRole });
    }

    /**
     * Create a login for a user without a username/password.
     * @param userId The ID of the user to create a login for.
     * @param options The options for creating the login.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async createUserLogin(userId: string, options: Commands.Overseer.CreateUserLoginOptions): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "createUserLogin", {
            userId,
            username: options.username,
            pass:     createHash("sha256").update(options.password).digest("base64"),
            hash:     createHmac("sha256", PublicPepper).update(options.password).digest("base64")
        });
    }

    /**
     * Perform a database dump.
     * @overseerRoleRequired
     * @calls {@link ResClient.call} (x9)
     */
    async databaseDump(): Promise<Record<"auth" | "core" | "file" | "identity" | "mail" | "note" | "report" | "tag", number>> {
        return this.client.api.call("core", "createId").then(idResult => Promise.all([
            this.client.api.call<{ duration: number; }>("auth.db", "backup", idResult).then(r => ({ auth: r.duration })),
            this.client.api.call<{ duration: number; }>("core.db", "backup", idResult).then(r => ({ core: r.duration })),
            this.client.api.call<{ duration: number; }>("file.db", "backup", idResult).then(r => ({ file: r.duration })),
            this.client.api.call<{ duration: number; }>("identity.db", "backup", idResult).then(r => ({ identity: r.duration })),
            this.client.api.call<{ duration: number; }>("mail.db", "backup", idResult).then(r => ({ mail: r.duration })),
            this.client.api.call<{ duration: number; }>("note.db", "backup", idResult).then(r => ({ note: r.duration })),
            this.client.api.call<{ duration: number; }>("report.db", "backup", idResult).then(r => ({ report: r.duration })),
            this.client.api.call<{ duration: number; }>("tag.db", "backup", idResult).then(r => ({ tag: r.duration }))
        ])).then(r => r.reduce((acc, cur) => ({ ...acc, ...cur }), {}) as never);
    }

    /**
     * Delete the registered OpenID from a user account.
     * @param userId The ID of the user.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async deleteUserOpenId(userId: string): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "deleteUserOpenId", { userId });
    }

    /**
     * Get a user by their ID.
     * @param userId The user ID.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async getUserById(userId: string): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "getUserById", { userId });
    }

    /**
     * Get a user by their username.
     * @param username The username.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async getUserByUsername(username: string): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "getUserByUsername", { username });
    }

    /**
     * Get a user's identity.
     * @param userId The ID of the user to get the identity of.
     * @overseerRoleRequired
     * @calls {@link ResClient.get}
     */
    async getUserIdentity(userId: string): Promise<Identity> {
        return this.client.api.get<Identity>(ResourceIDs.IDENTITY({ id: userId }));
    }

    /**
     * Get the ip addresses for a user.
     * @param userId The ID of the user.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async getUserIps(userId: string): Promise<Array<UserIp>> {
        return this.client.api.call<Array<UserIp>>(ResourceIDs.IDENTITY({ id: userId }), "getIps");
    }

    /**
     * Get users by their email address.
     * @param email The email address.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async getUsersByEmail(email: string): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "getUsersByEmail", { email });
    }

    /**
     * Remove a title from a user.
     * @param userId The ID of the user to remove the title from.
     * @param idRole The title to remove from the user.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async removeUserTitle(userId: string, idRole: Titles): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "removeUserIdRole", { userId, idRole });
    }

    /**
     * Set a user's password.
     * @param userId The ID of the user.
     * @param password The new password.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async resetPassword(userId: string, password: string): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "resetPassword", {
            userId,
            newPass: createHash("sha256").update(password).digest("hex"),
            newHash: createHmac("sha256", PublicPepper).update(password).digest("hex")
        });
    }

    /**
     * Set the realm config.
     * @param player A {@link Player} instance or ID.
     * @param options The options to set.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async setConfig(player: string | Player, options: Commands.Overseer.SetConfigOptions): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "setConfig", options);
    }

    /**
     * Set the attributes of a user.
     * @param userId The ID of the user.
     * @param options The options to set.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async setUser(userId: string, options: Commands.Overseer.SetUserOptions): Promise<unknown> {
        return this.client.api.call(ResourceIDs.IDENTITY({ id: userId }), "set", { userId, ...options });
    }

    /**
     * Transfer a character to a player.
     * @param player A {@link Player} instance or ID.
     * @param targetId The ID of the target player.
     * @param charId The ID of the character.
     * @overseerRoleRequired
     */
    async transferChar(player: string | Player, targetId: string, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.PLAYER({ id: modelId(player) }), "transferChar", { playerId: targetId, charId })
            .then(r => r.char);
    }

    /**
     * Wipe a user.
     * @param userId The ID of the user.
     * @overseerRoleRequired
     * @calls {@link ResClient.call}
     */
    async wipeUser(userId: string): Promise<unknown> {
        return this.client.api.call<unknown>("identity.overseer", "wipeUser", { userId });
    }
}
