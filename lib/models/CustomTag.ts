import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { TagProperties } from "../generated/models/types.js";
import { TagDefinition } from "../generated/models/definitions.js";
import type Commands from "../util/commands.js";
import type { KeyResponse, TagPref } from "../util/types.js";
import type { ResClient } from "resclient-ts";

declare interface CustomTag extends BaseModel, TagProperties {}
// do not edit the first line of the class comment
/**
 * A custom tag.
 * @resourceID {@link ResourceIDs.TAG | TAG}
 */
class CustomTag extends BaseModel implements TagProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TagDefinition });
    }

    /**
     * Add this tag to a character.
     * @param ctrl A {@link ControlledCharacter} instance or id.
     * @param pref The preference for the tag.
     * @calls {@link ControlledCommands.setTags}
     */
    async add(ctrl: string | ControlledCharacter, pref: TagPref): Promise<null> {
        return this.client.commands.controlled.setTags(ctrl, { [this.id]: pref });
    }

    /**
     * Delete this tag.
     * @note Alias of {@link remove} with `ctrl` autofilled.
     * @calls {@link remove}
     */
    async delete(): Promise<null> {
        const ctrl = await this.getCtrl();
        return this.remove(ctrl);
    }

    /**
     * Get the controlled character this tag belong to.
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(c => c.tags.hasKey(this.id), true);
    }

    /**
     * Remove this tag from a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @calls {@link ControlledCommands.setTags}
     */
    async remove(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.setTags(ctrl, { [this.id]: null });
    }

    /**
     * Set attributes for this tag.
     * @param options Options to set for the tag.
     * @calls {@link MiscCommands.setTag}
     */
    async set(options: Commands.Misc.SetTagOptions): Promise<KeyResponse> {
        return this.client.commands.misc.setTag(this.id, options);
    }
}

export default CustomTag;
