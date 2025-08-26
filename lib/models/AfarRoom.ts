import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { AfarRoomProperties } from "../generated/models/types.js";
import { AfarRoomDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface AfarRoom extends BaseModel, AfarRoomProperties {}
// do not edit the first line of the class comment
/**
 * A partial room seen as an exit target.
 * @resourceID AFAR_ROOM(core.room.{id}.afar)
 */
class AfarRoom extends BaseModel implements AfarRoomProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: AfarRoomDefinition });
    }
}

export default AfarRoom;
