import BaseCollection from "./BaseCollection.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The characters owned by the player.
 * @resourceID {@link ResourceIDs.OWNED_CHARACTERS | OWNED_CHARACTERS}
 */
export default class OwnedCharacters extends BaseCollection<OwnedCharacter> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
