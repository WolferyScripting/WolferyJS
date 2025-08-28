import BaseCollectionModel from "./BaseCollectionModel.js";
import CharacterMin from "./CharacterMin.js";
import type WolferyJS from "../WolferyJS.js";
import type { FocusCharsProperties } from "../generated/models/types.js";
import type { ResClient } from "resclient-ts";

declare interface FocusChars extends BaseCollectionModel<CharacterMin>, FocusCharsProperties {}
// do not edit the first line of the class comment
/**
 * The characters being focused on.
 * @resourceID {@link ResourceIDs.CHARACTER_FOCUS_CHARS | CHARACTER_FOCUS_CHARS}
 * @resourceID {@link ResourceIDs.PUPPET_FOCUS_CHARS | PUPPET_FOCUS_CHARS}
 */
class FocusChars extends BaseCollectionModel<CharacterMin> implements FocusCharsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof CharacterMin);
    }
}

export default FocusChars;
