import BaseCollection from "./BaseCollection.js";
import type Node from "../models/Node.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The teleport nodes a character has.
 * @resourceID {@link ResourceIDs.CHARACTER_NODES | CHARACTER_NODES}
 */
export default class CharacterNodes extends BaseCollection<Node> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
