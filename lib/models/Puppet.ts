import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { PuppetProperties } from "../generated/models/types.js";
import { PuppetDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Puppet extends BaseModel, PuppetProperties {}
// do not edit the first line of the class comment
/**
 * A puppet.
 * @resourceID {@link ResourceIDs.PUPPET | PUPPET}
 */
class Puppet extends BaseModel implements PuppetProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: PuppetDefinition });
    }

    get id(): string {
        return this.puppet.id;
    }

    /**
     * Set character settings.
     * @param options The settings to apply.
     */
    async setSettings(options: Omit<Commands.Player.SetCharSettingsOptions, "puppeteerId">): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.setCharSettings(this.id, { puppeteerId: this.char.id, ...options }));
    }

    /**
     * Wake up and control this character. This will not error if the character is already controlled or already awake.
     * @param hidden If the character should be hidden from the awake list. Only applicable to bots.
     * @returns The controlled puppet.
     */
    async wakeup(hidden?: boolean): Promise<ControlledCharacter> {
        return this.client.commands.core.getPlayer().then(player => player.controlPuppet(this.char.id, this.id, true)).then(ctrl => ((ctrl.wakeup(hidden, true), ctrl)));
    }
}

export default Puppet;
