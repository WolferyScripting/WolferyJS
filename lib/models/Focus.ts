import type FocusChars from "./FocusChars.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { FocusProperties } from "../generated/models/types.js";
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

    async getChars(): Promise<FocusChars> {
        if (ResourceIDs.PUPPET_FOCUS.regex.test(this.rid)) {
            const { char, puppet } = ResourceIDs.PUPPET_FOCUS.parts(this.rid);
            return this.api.get<FocusChars>(ResourceIDs.PUPPET_FOCUS_CHARS({ char, puppet }));
        } else {
            const { id } = ResourceIDs.CHARACTER_FOCUS.parts(this.rid);
            return this.api.get<FocusChars>(ResourceIDs.CHARACTER_FOCUS_CHARS({ id }));
        }
    }
}

export interface FocusOptions {
    /** Hex color code prefixed with `#`. */
    color: string;
}

export default Focus;
