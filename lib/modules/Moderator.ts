import Base from "./Base.js";
import type { BasicCharacterResponse, OptionalBasicCharacterResponse } from "../util/types.js";
import type Character from "../models/Character.js";
import type Commands from "../util/commands.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";

interface RawCharacterInspection extends BasicCharacterResponse<"char"> {
    banMatches: Array<OptionalBasicCharacterResponse<"char"> & { banReason: string; banned: number; }>;
    banned: number | null;
    charCreated: number;
    playerJoined: number;
    trust: string;
}
export interface CharacterInspection {
    banMatches: Array<{ banReason: string; banned: number; char: Character | null; }>;
    banned: number | null;
    char: Character;
    charCreated: number;
    playerJoined: number;
    trust: Record<"trusted" | "npn" | "bannedIP", boolean>;
}

export default class Moderator extends Base {
    private _formatTrust(trust: string): Record<"trusted" | "npn" | "bannedIP", boolean> {
        trust = trust.toUpperCase();
        return {
            trusted:  trust.includes("T"),
            npn:      trust.includes("V"),
            bannedIP: trust.includes("B")
        };
    }

    /**
     * Ban a player.
     * @param charId The ID of the character to ban.
     * @param reason The ban reason.
     * @roleRequired Moderator
     */
    async banPlayer(charId: string, reason: string): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("banPlayer", { charId, reason }));
    }

    /**
     * Compare two characters.
     * @param charId The ID of the character to compare.
     * @param compareCharId The ID of the character to compare with.
     * @roleRequired Moderator
     */
    async compare(charId: string, compareCharId: string): Promise<Record<"emailMatch" | "ipMatch" | "userMatch", boolean>> {
        return this.client.modules.core.getPlayer().then(player => player.call<Record<"emailMatch" | "ipMatch" | "userMatch", boolean>>("compare", { charId, compareCharId }));
    }

    /**
     * Inspect a character.
     * @param charId The ID of the character to inspect.
     * @roleRequired Moderator
     */
    async inspect(charId: string): Promise<CharacterInspection> {
        return this.client.modules.core.getPlayer().then(player => player.call<RawCharacterInspection>("inspectChar", { charId })
            .then(async r => ({
                ...r,
                char:       await player.basicChar(r, "char"),
                trust:      this._formatTrust(r.trust),
                banMatches: await Promise.all(r.banMatches.map(async b => ({ ...b, char: await player.basicChar(b, "char") })))
            })));
    }

    /**
     * Set attributes about a player.
     * @param charId The ID of the character to set the attributes for.
     * @param options The attributes to set.
     * @roleRequired Moderator
     */
    async setPlayer(charId: string, options: Commands.Moderator.SetPlayerOptions): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("setPlayer", { charId, ...options }));
    }

    /**
     * Suspend a character.
     * @param ctrl The controlled character to suspend the character with.
     * @param charId The ID of the character to suspend.
     * @param reason The reason for suspending the character.
     * @roleRequired Moderator
     */
    async suspend(ctrl: ControlledCharacter, charId: string, reason: string): Promise<Character> {
        return ctrl.call<BasicCharacterResponse<"char">>("suspend", { charId, reason })
            .then(r => this.client.modules.core.getPlayer().then(player => player.basicChar(r, "char")));
    }

    /**
     * Unban a player.
     * @param charId The ID of the character to unban.
     * @roleRequired Moderator
     */
    async unbanPlayer(charId: string): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("unbanPlayer", { charId }));
    }

    /**
     * Unsuspend a character.
     * @param ctrl The controlled character to unsuspend the character with.
     * @param charId The ID of the character to unsuspend.
     * @roleRequired Moderator
     */
    async unsuspend(ctrl: ControlledCharacter, charId: string): Promise<Character> {
        return ctrl.call<BasicCharacterResponse<"char">>("unsuspend", { charId })
            .then(r => this.client.modules.core.getPlayer().then(player => player.basicChar(r, "char")));
    }

    /**
     * Send a warning to characters.
     * @param charIds The IDs of the characters to warn.
     * @param msg The message of the warning.
     * @param pose If the warning is a pose.
     * @roleRequired Moderator
     */
    async warn(charIds: Array<string>, msg: string, pose?: boolean): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("warn", { charIds, msg, pose }));
    }

    /**
     * Wipe a character's avatar.
     * @param charId The ID of the character to wipe the avatar for.
     * @roleRequired Moderator
     */
    async wipeCharAvatar(charId: string): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("wipeCharAvatar", { charId }));
    }

    /**
     * Wipe a character's image.
     * @param charId The ID of the character to wipe the image for.
     * @roleRequired Moderator
     */
    async wipeCharImage(charId: string): Promise<unknown> {
        return this.client.modules.core.getPlayer().then(player => player.call("wipeCharImage", { charId }));
    }
}
