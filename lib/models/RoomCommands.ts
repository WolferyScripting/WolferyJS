import BaseCollectionModel from "./BaseCollectionModel.js";
import RoomCommand from "./RoomCommand.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomCommandsProperties } from "../generated/models/types.js";
import type { ResClient } from "resclient-ts";

declare interface RoomCommands extends BaseCollectionModel<RoomCommand>, RoomCommandsProperties {}
// do not edit the first line of the class comment
/**
 * The commands in a room.
 * @resourceID {@link ResourceIDs.ROOM_COMMANDS | ROOM_COMMANDS}
 */
class RoomCommands extends BaseCollectionModel<RoomCommand> implements RoomCommandsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof RoomCommand);
    }
}

export default RoomCommands;
