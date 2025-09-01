import BaseCollectionModel from "./BaseCollectionModel.js";
import RoomCommand from "./RoomCommand.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The commands in a room.
 * @resourceID {@link ResourceIDs.ROOM_COMMANDS | ROOM_COMMANDS}
 */
class RoomCommands extends BaseCollectionModel<RoomCommand, typeof ResourceIDs.ROOM_COMMAND> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof RoomCommand, {
            ridConstructor: ResourceIDs.ROOM_COMMAND
        });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("roomCommands"));
    }
}

export default RoomCommands;
