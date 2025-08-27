import RoomDetails from "./RoomDetails.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomInstanceDetailsProperties } from "../generated/models/types.js";
import { RoomInstanceDetailsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomInstanceDetails extends RoomDetails, RoomInstanceDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A detailed view of a room instance.
 * @resourceID {@link ResourceIDs.ROOM_INSTANCE_DETAILS | ROOM_INSTANCE_DETAILS}
 */
class RoomInstanceDetails extends RoomDetails implements RoomInstanceDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomInstanceDetailsDefinition });
    }
}

export default RoomInstanceDetails;
