import BaseModel from "./BaseModel.js";
import ControlledCharacter from "./ControlledCharacter.js";
import type CustomTag from "./CustomTag.js";
import type WolferyJS from "../WolferyJS.js";
import type { TagProperties } from "../generated/models/types.js";
import { TagDefinition } from "../generated/models/definitions.js";
import type { KeyResponse, TagPref } from "../util/types.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

declare interface GlobalTag extends BaseModel, TagProperties {}
// do not edit the first line of the class comment
/**
 * A global tag.
 * @resourceID {@link ResourceIDs.TAG | TAG}
 */
class GlobalTag extends BaseModel implements TagProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: TagDefinition });
    }

    /**
     * Add this tag to a character.
     * @param ctrl A {@link ControlledCharacter} instance or id.
     * @param pref The preference for the tag.
     */
    async add(ctrl: string | ControlledCharacter, pref: TagPref): Promise<null> {
        return this.client.commands.controlled.setTags(ctrl, { [this.id]: pref });
    }

    /**
     * Add this tag to a character with a custom description.
     * @param ctrl A {@link ControlledCharacter} instance or id.
     * @param pref The preference for the tag.
     * @param desc The description for the tag.
     */
    async addWithDescription(ctrl: string | ControlledCharacter, pref: TagPref, desc: string): Promise<CustomTag> {
        if (ctrl instanceof ControlledCharacter) await ctrl.removeTag(this.id);
        return this.client.commands.controlled.createTag(ctrl, { key: this.key, desc, pref });
    }

    /**
     * Delete this tag.
     * @adminRoleRequired
     */
    async delete(): Promise<KeyResponse> {
        return this.client.commands.admin.deleteGlobalTag(this.id);
    }

    /**
     * Remove this tag from a character.
     * @param ctrl A {@link ControlledCharacter} instance or id.
     */
    async remove(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.setTags(ctrl, { [this.id]: null });
    }

    /**
     * Set attributes of this tag.
     * @param options The options to set.
     * @adminRoleRequired
     */
    async set(options: Commands.Admin.SetGlobalTagOptions): Promise<KeyResponse> {
        return this.client.commands.admin.setGlobalTag(this.id, options);
    }
}

export default GlobalTag;
