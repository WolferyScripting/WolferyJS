import Character from "./Character.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The awake characters in the realm.
 * @resourceID {@link ResourceIDs.AWAKE_CHARACTERS | AWAKE_CHARACTERS}
 */
class AwakeCharacters extends BaseCollectionModel<Character> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof Character);
    }
}

export default AwakeCharacters;
