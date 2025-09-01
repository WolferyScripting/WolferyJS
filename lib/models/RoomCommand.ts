import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomCommandProperties } from "../generated/models/types.js";
import { RoomCommandDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomCommand extends BaseModel, RoomCommandProperties {}
// do not edit the first line of the class comment
/**
 * A command in a room.
 * @resourceID {@link ResourceIDs.ROOM_COMMAND | ROOM_COMMAND}
 */
class RoomCommand extends BaseModel implements RoomCommandProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomCommandDefinition });
    }

    /**
     * Execute this command.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param values The values for the command.
     * @calls {@link ControlledCommands.execRoomCmd}
     */
    async exec(ctrl: string | ControlledCharacter, values: Record<string, { value: unknown; }> | null = null): Promise<null> {
        return this.client.commands.controlled.execRoomCmd(ctrl, this.id, values);
    }
}

export default RoomCommand;
