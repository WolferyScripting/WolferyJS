import BaseCollection from "./BaseCollection.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The controlled characters.
 * @resourceID {@link ResourceIDs.CONTROLLED_CHARACTERS | CONTROLLED_CHARACTERS}
 */
export default class ControlledCharacters extends BaseCollection<ControlledCharacter> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
