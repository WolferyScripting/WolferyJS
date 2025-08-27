import Base from "./Base.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Identity from "../models/Identity.js";
import type { UserIp, BasicCharacterResponse, Titles } from "../util/types.js";
import type Commands from "../util/commands.js";
import { PublicPepper } from "../util/Constants.js";
import type Character from "../models/Character.js";
import { createHash, createHmac } from "node:crypto";

export default class Overseer extends Base {
    /**
     * Add a title to a user.
     * @param userId The ID of the user to add the title to.
     * @param idRole The title to add to the user.
     * @roleRequired Overseer
     */
    async addUserTitle(userId: string, idRole: Titles): Promise<unknown> {
        return this.client.api.call("identity.overseer", "addUserIdRole", { userId, idRole });
    }

    /**
     * Create a login for a user without a username/password.
     * @param userId The ID of the user to create a login for.
     * @param options The options for creating the login.
     * @roleRequired Overseer
     */
    async createUserLogin(userId: string, options: Commands.Overseer.CreateUserLoginOptions): Promise<unknown> {
        return this.client.api.call("identity.overseer", "createUserLogin", {
            userId,
            username: options.username,
            pass:     createHash("sha256").update(options.password).digest("base64"),
            hash:     createHmac("sha256", PublicPepper).update(options.password).digest("base64")
        });
    }

    /**
     * Perform a database dump.
     * @roleRequired Overseer
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
     * @roleRequired Overseer
     */
    async deleteUserOpenId(userId: string): Promise<unknown> {
        return this.client.api.call("identity.overseer", "deleteUserOpenId", { userId });
    }

    /**
     * Get a user by their ID.
     * @param userId The user ID.
     * @roleRequired Overseer
     */
    async getUserById(userId: string): Promise<unknown> {
        return this.client.api.call("identity.overseer", "getUserById", { userId });
    }

    /**
     * Get a user by their username.
     * @param username The username.
     * @roleRequired Overseer
     */
    async getUserByUsername(username: string): Promise<unknown> {
        return this.client.api.call("identity.overseer", "getUserByUsername", { username });
    }

    /**
     * Get a user's identity.
     * @param userId The ID of the user to get the identity of.
     * @roleRequired Overseer
     */
    async getUserIdentity(userId: string): Promise<Identity> {
        return this.client.api.get<Identity>(ResourceIDs.IDENTITY({ id: userId }));
    }

    /**
     * Get the ip addresses for a user.
     * @param userId The ID of the user.
     * @roleRequired Overseer
     */
    async getUserIps(userId: string): Promise<Array<UserIp>> {
        return this.client.api.call(ResourceIDs.IDENTITY({ id: userId }), "getIps");
    }

    /**
     * Get users by their email address.
     * @param email The email address.
     * @roleRequired Overseer
     */
    async getUsersByEmail(email: string): Promise<unknown> {
        return this.client.api.call("identity.overseer", "getUsersByEmail", { email });
    }

    /**
     * Remove a title from a user.
     * @param userId The ID of the user to remove the title from.
     * @param idRole The title to remove from the user.
     * @roleRequired Overseer
     */
    async removeUserTitle(userId: string, idRole: Titles): Promise<unknown> {
        return this.client.api.call("identity.overseer", "removeUserIdRole", { userId, idRole });
    }

    /**
     * Set a user's password.
     * @param userId The ID of the user.
     * @param password The new password.
     * @roleRequired Overseer
     */
    async resetPassword(userId: string, password: string): Promise<unknown> {
        return this.client.api.call("identity.overseer", "resetPassword", {
            userId,
            newPass: createHash("sha256").update(password).digest("hex"),
            newHash: createHmac("sha256", PublicPepper).update(password).digest("hex")
        });
    }

    /**
     * Set the realm config.
     * @param options The options to set.
     * @roleRequired Overseer
     */
    async setConfig(options: Commands.Overseer.SetConfigOptions): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("setConfig", options));
    }

    /**
     * Set the attributes of a user.
     * @param userId The ID of the user.
     * @param options The options to set.
     * @roleRequired Overseer
     */
    async setUser(userId: string, options: Commands.Overseer.SetUserOptions): Promise<unknown> {
        return this.client.api.call(ResourceIDs.IDENTITY({ id: userId }), "set", { userId, ...options });
    }

    /**
     * Transfer a character to a player.
     * @param playerId The ID of the player.
     * @param charId The ID of the character.
     * @roleRequired Overseer
     */
    async transferChar(playerId: string, charId: string): Promise<Character> {
        return this.client.modules.core.getPlayer().then(player => player.call<BasicCharacterResponse<"char">>("transferChar", { playerId, charId })
            .then(r => player.basicChar(r, "char")));
    }

    /**
     * Wipe a user.
     * @param userId The ID of the user.
     * @roleRequired Overseer
     */
    async wipeUser(userId: string): Promise<unknown> {
        return this.client.api.call("identity.overseer", "wipeUser", { userId });
    }
}
