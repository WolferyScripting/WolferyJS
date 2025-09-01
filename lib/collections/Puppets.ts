import BaseCollection from "./BaseCollection.js";
import type Puppet from "../models/Puppet.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The puppets that the player can control.
 * @resourceID {@link ResourceIDs.PUPPETS | PUPPETS}
 */
export default class Puppets extends BaseCollection<Puppet, typeof ResourceIDs.PUPPET> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.PUPPET
        });
    }
}
