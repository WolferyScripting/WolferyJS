import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomCommandProperties } from "../generated/models/types.js";
import { RoomCommandDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomCommand extends BaseModel, RoomCommandProperties {}
// do not edit the first line of the class comment
/**
 * A command in a room.
 */
class RoomCommand extends BaseModel implements RoomCommandProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomCommandDefinition });
    }
}

export default RoomCommand;
