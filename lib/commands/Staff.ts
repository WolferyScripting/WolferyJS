import Base from "./Base.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import { modelId } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Player from "../models/Player.js";

export default class StaffCommands extends Base {
    /**
     * Force join a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to join. The character must be awake.
     * @staffRoleRequired
     * @calls {@link ResClient.call}
     */
    async forceJoin(ctrl: string | ControlledCharacter, charId: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "forceJoin", { charId });
    }

    /**
     * Force summon a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to summon. The character must be awake.
     * @staffRoleRequired
     * @calls {@link ResClient.call}
     */
    async forceSummon(ctrl: string | ControlledCharacter, charId: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "forceSummon", { charId });
    }

    /**
     * Send a helping message to a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to send the message to.
     * @param msg The message to send.
     * @param pose Whether the message is a pose.
     * @staffRoleRequired
     * @calls {@link ResClient.call}
     */
    async helping(ctrl: string | ControlledCharacter, charId: string, msg: string, pose?: boolean): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "helping", { charId, msg, pose });
    }

    /**
     * Set if a controlled character is listening to the helper channel.
     * @param player A {@link Player} instance or ID.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param flag The flag to set.
     * @staffRoleRequired
     * @calls {@link PlayerCommands.setCharSettings}
     */
    async setHelperChannel(player: string | Player, ctrl: string | ControlledCharacter, flag: boolean): Promise<null> {
        return this.client.commands.player.setCharSettings(player, modelId(ctrl), { ishelping: flag });
    }

    /**
     * Set the main character for a player.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to set as main, or null to unset.
     * @staffRoleRequired
     * @calls {@link PlayerCommands.setPreference}
     */
    async setMain(player: string | Player, charId: string | null): Promise<null> {
        return this.client.commands.player.setPreference(player, { mainChar: charId ?? "" });
    }
}
