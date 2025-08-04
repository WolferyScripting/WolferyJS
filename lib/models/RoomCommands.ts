import BaseCollectionModel from "./BaseCollectionModel.js";
import RoomCommand from "./RoomCommand.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomCommandsProperties } from "../generated/models/types.js";
import { RoomCommandsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomCommands extends BaseCollectionModel<RoomCommand>, RoomCommandsProperties {}
class RoomCommands extends BaseCollectionModel<RoomCommand> implements RoomCommandsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, RoomCommand, { definition: RoomCommandsDefinition });
    }
}

export default RoomCommands;
