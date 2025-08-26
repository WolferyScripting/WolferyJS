import BaseModel from "./BaseModel.js";
import type FocusChars from "./FocusChars.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { FocusProperties } from "../generated/models/types.js";
import { FocusDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

interface Focus extends BaseModel, FocusProperties {}
// do not edit the first line of the class comment
/**
 * The focus options for a character.
 */
class Focus extends BaseModel implements FocusProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: FocusDefinition });
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

export default Focus;
