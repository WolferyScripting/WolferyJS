/* eslint-disable jsdoc/tag-lines */
import BaseCollectionModel from "./BaseCollectionModel.js";
import CharacterMin from "./CharacterMin.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The characters that are muted.
 * @resourceID {@link ResourceIDs.MUTED_CHARACTERS | MUTED_CHARACTERS}
 */
class MutedCharacters extends BaseCollectionModel<CharacterMin>  {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof CharacterMin);
    }
}

export default MutedCharacters;
