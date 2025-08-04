import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomChildProperties } from "../generated/models/types.js";
import { RoomChildDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomChild extends BaseModel, RoomChildProperties {}
class RoomChild extends BaseModel implements RoomChildProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomChildDefinition });
    }
}

export default RoomChild;
