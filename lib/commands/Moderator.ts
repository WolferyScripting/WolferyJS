import Base from "./Base.js";
import type { CharacterInspection, CharacterResponse, RawCharacterInspection } from "../util/types.js";
import type Commands from "../util/commands.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type Player from "../models/Player.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import { modelId } from "../util/Util.js";

export default class ModeratorCommands extends Base {
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
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to ban.
     * @param reason The ban reason.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async banPlayer(player: string | Player, charId: string, reason: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "banPlayer", { charId, reason });
    }

    /**
     * Compare two characters.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to compare.
     * @param compareCharId The ID of the character to compare with.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async compare(player: string | Player, charId: string, compareCharId: string): Promise<Record<"emailMatch" | "ipMatch" | "userMatch", boolean>> {
        return this.client.api.call<Record<"emailMatch" | "ipMatch" | "userMatch", boolean>>(ResourceIDs.PLAYER({ id: modelId(player) }), "compare", { charId, compareCharId });
    }

    /**
     * Inspect a character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to inspect.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call} > {@link WolferyJS.getChar}
     */
    async inspect(player: string | Player, charId: string): Promise<CharacterInspection> {
        return this.client.api.call<RawCharacterInspection>(ResourceIDs.PLAYER({ id: modelId(player) }), "inspectChar", { charId })
            .then(async r => ({
                ...r,
                char:       await this.client.getChar(r.char.id),
                trust:      this._formatTrust(r.trust),
                banMatches: await Promise.all(r.banMatches.map(async b => ({ ...b, char: b.char ? await this.client.getChar(b.char.id) : null })))
            }));
    }

    /**
     * Set attributes about a player.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to set the attributes for.
     * @param options The attributes to set.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async setPlayer(player: string | Player, charId: string, options: Commands.Moderator.SetPlayerOptions): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "setPlayer", { charId, ...options });
    }

    /**
     * Suspend a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to suspend.
     * @param reason The reason for suspending the character.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async suspend(ctrl: string | ControlledCharacter, charId: string, reason: string): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "suspend", { charId, reason })
            .then(r => r.char);
    }

    /**
     * Unban a player.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to unban.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async unbanPlayer(player: string | Player, charId: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "unbanPlayer", { charId });
    }

    /**
     * Unsuspend a character.
     * @param ctrl The controlled character to unsuspend the character with.
     * @param charId The ID of the character to unsuspend.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async unsuspend(ctrl: string | ControlledCharacter, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "unsuspend", { charId })
            .then(r => r.char);
    }

    /**
     * Send a warning to characters.
     * @param player A {@link Player} instance or ID.
     * @param charIds The IDs of the characters to warn.
     * @param msg The message of the warning.
     * @param pose If the warning is a pose.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async warn(player: string | Player, charIds: Array<string>, msg: string, pose?: boolean): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "warn", { charIds, msg, pose });
    }

    /**
     * Wipe a character's avatar.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to wipe the avatar for.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async wipeCharAvatar(player: string | Player, charId: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "wipeCharAvatar", { charId });
    }

    /**
     * Wipe a character's image.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to wipe the image for.
     * @moderatorRoleRequired
     * @calls {@link ResClient.call}
     */
    async wipeCharImage(player: string | Player, charId: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "wipeCharImage", { charId });
    }
}
