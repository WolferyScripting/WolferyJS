import Base from "./Base.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";

export default class Staff extends Base {
    /**
     * Force join a character.
     * @param ctrl The character to join with.
     * @param charId The ID of the character to join. The character must be awake.
     * @staffRoleRequired
     */
    async forceJoin(ctrl: ControlledCharacter, charId: string): Promise<unknown> {
        return ctrl.call("forceJoin", { charId });
    }

    /**
     * Force summon a character.
     * @param ctrl The character to summon with.
     * @param charId The ID of the character to summon. The character must be awake.
     * @staffRoleRequired
     */
    async forceSummon(ctrl: ControlledCharacter, charId: string): Promise<unknown> {
        return ctrl.call("forceSummon", { charId });
    }

    /**
     * Send a helping message to a character.
     * @param ctrl The character to send the message from.
     * @param charId The ID of the character to send the message to.
     * @param msg The message to send.
     * @param pose Whether the message is a pose.
     * @staffRoleRequired
     */
    async helping(ctrl: ControlledCharacter, charId: string, msg: string, pose?: boolean): Promise<unknown> {
        return ctrl.call("helping", { charId, msg, pose });
    }

    /**
     * Set if a controlled character is listening to the helper channel.
     * @param ctrl The controlled character to set for.
     * @param flag The flag to set.
     * @staffRoleRequired
     */
    async setHelperChannel(ctrl: ControlledCharacter, flag: boolean): Promise<null> {
        return this.client.modules.core.getPlayer().then(player => player.setCharSettings(ctrl.id, { puppeteerId: ctrl.puppeteer?.id, ishelping: flag }));
    }

    async setMain(charId: string | null): Promise<null> {
        return this.client.modules.core.getPlayer().then(player => player.call("setPreference", { mainChar: charId ?? "" }));
    }
}
