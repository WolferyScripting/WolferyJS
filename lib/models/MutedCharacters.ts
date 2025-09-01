/* eslint-disable jsdoc/tag-lines */
import BaseCollectionModel from "./BaseCollectionModel.js";
import CharacterMin from "./CharacterMin.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The characters that are muted.
 * @resourceID {@link ResourceIDs.MUTED_CHARACTERS | MUTED_CHARACTERS}
 */
class MutedCharacters extends BaseCollectionModel<CharacterMin, typeof ResourceIDs.CHARACTER_MIN> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof CharacterMin, {
            ridConstructor: ResourceIDs.CHARACTER_MIN
        });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("mutedCharacters"));
    }
}

export default MutedCharacters;
