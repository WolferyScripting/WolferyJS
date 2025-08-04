import RoomDetails from "./RoomDetails.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomInstanceDetailsProperties } from "../generated/models/types.js";
import { RoomInstanceDetailsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomInstanceDetails extends RoomDetails, RoomInstanceDetailsProperties {}
class RoomInstanceDetails extends RoomDetails implements RoomInstanceDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomInstanceDetailsDefinition });
    }
}

export default RoomInstanceDetails;
