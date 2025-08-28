import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomProperties } from "../generated/models/types.js";
import { RoomDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Room extends BaseModel, RoomProperties {}
// do not edit the first line of the class comment
/**
 * A room.
 * @resourceID {@link ResourceIDs.ROOM | ROOM}
 */
class Room extends BaseModel implements RoomProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomDefinition });
    }
}

export default Room;
