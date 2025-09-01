import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { SettingsProperties } from "../generated/models/types.js";
import { SettingsDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

declare interface Settings extends BaseModel, SettingsProperties {}
// do not edit the first line of the class comment
/**
 * The settings for a character or puppet.
 * @resourceID {@link ResourceIDs.CHARACTER_SETTINGS | CHARACTER_SETTINGS}
 * @resourceID {@link ResourceIDs.PUPPET_SETTINGS | PUPPET_SETTINGS}
 */
class Settings extends BaseModel implements SettingsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: SettingsDefinition });
    }

    get charId(): string {
        if (this.isPuppet) return ResourceIDs.PUPPET_SETTINGS.parts(this.rid).puppet;
        return ResourceIDs.CHARACTER_SETTINGS.parts(this.rid).id;
    }

    get isPuppet(): boolean {
        return ResourceIDs.PUPPET_SETTINGS.regex.test(this.rid);
    }

    get puppeteerId(): string | null {
        if (!this.isPuppet) return null;
        return ResourceIDs.PUPPET_SETTINGS.parts(this.rid).ctrl;
    }

    /**
     * Set settings.
     * @param options The settings to set.
     * @playerRequired
     */
    async set(options: Omit<Commands.Player.SetCharSettingsOptions, "puppeteerId">): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.setCharSettings(this.charId, { puppeteerId: this.puppeteerId ?? undefined, ...options }));
    }
}

export default Settings;
