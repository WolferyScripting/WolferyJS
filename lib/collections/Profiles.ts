import BaseCollection from "./BaseCollection.js";
import type Profile from "../models/Profile.js";
import { toID } from "../util/Util.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The profiles for a character.
 * @resourceID {@link ResourceIDs.PROFILES | PROFILES}
 */
export default class Profiles extends BaseCollection<Profile> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
