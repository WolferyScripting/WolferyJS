import type FocusChars from "./FocusChars.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type Character from "./Character.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { FocusProperties } from "../generated/models/types.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

interface Focus extends BaseCollectionModel<FocusOptions>, FocusProperties {}
// do not edit the first line of the class comment
/**
 * The focus options for a character.
 * @resourceID {@link ResourceIDs.CHARACTER_FOCUS | CHARACTER_FOCUS}
 * @resourceID {@link ResourceIDs.PUPPET_FOCUS | PUPPET_FOCUS}
 */
class Focus extends BaseCollectionModel<FocusOptions> implements FocusProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, () => true);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("focus"));
    }

    get isPuppet(): boolean {
        return ResourceIDs.PUPPET_FOCUS.regex.test(this.rid);
    }

    /**
     * Focus a character.
     * @param targetId The ID of the character to focus.
     * @param options The options for focusing.
     * @returns The character that was focused.
     * @playerRequired
     */
    async focus(targetId: string, options?: Omit<Commands.Player.FocusCharOptions, "puppeteerId">): Promise<Character> {
        let charId: string, puppeteerId: string | undefined;
        if (this.isPuppet) {
            ({ char: puppeteerId, puppet: charId } = ResourceIDs.PUPPET_FOCUS.parts(this.rid));
        } else {
            ({ id: charId } = ResourceIDs.CHARACTER_FOCUS.parts(this.rid));
        }

        return this.client.commands.core.getPlayer().then(player => player.focusChar(charId, targetId, { puppeteerId, ...options }));
    }

    async getChars(): Promise<FocusChars> {
        if (this.isPuppet) {
            const { char, puppet } = ResourceIDs.PUPPET_FOCUS.parts(this.rid);
            return this.api.get<FocusChars>(ResourceIDs.PUPPET_FOCUS_CHARS({ char, puppet }));
        } else {
            const { id } = ResourceIDs.CHARACTER_FOCUS.parts(this.rid);
            return this.api.get<FocusChars>(ResourceIDs.CHARACTER_FOCUS_CHARS({ id }));
        }
    }

    /**
     * Unfocus a character.
     * @param targetId The ID of the character to unfocus.
     * @returns The character that was unfocused.
     * @playerRequired
     */
    async unfocus(targetId: string): Promise<Character> {
        let charId: string, puppeteerId: string | undefined;
        if (this.isPuppet) {
            ({ char: puppeteerId, puppet: charId } = ResourceIDs.PUPPET_FOCUS.parts(this.rid));
        } else {
            ({ id: charId } = ResourceIDs.CHARACTER_FOCUS.parts(this.rid));
        }

        return this.client.commands.core.getPlayer().then(player => player.unfocusChar(charId, targetId, puppeteerId));
    }
}

export interface FocusOptions {
    /** Hex color code prefixed with `#`. */
    color: string;
}

export default Focus;
