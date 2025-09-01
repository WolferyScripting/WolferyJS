import type ControlledCharacter from "./ControlledCharacter.js";
import BaseModel from "./BaseModel.js";
import type ExitDetails from "./ExitDetails.js";
import type Room from "./Room.js";
import type RoomDetails from "./RoomDetails.js";
import type WolferyJS from "../WolferyJS.js";
import type { ExitProperties } from "../generated/models/types.js";
import { ExitDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import { type ResClient } from "resclient-ts";

declare interface Exit extends BaseModel, ExitProperties {}
// do not edit the first line of the class comment
/**
 * An exit.
 * @resourceID {@link ResourceIDs.EXIT | EXIT}
 */
class Exit extends BaseModel implements ExitProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ExitDefinition });
    }

    /**
     * Delete the exit. The controlled character that owns the room must be in the room.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.deleteExit}
     */
    async delete(): Promise<Exit> {
        const ctrl = await this.getCtrl();
        return ctrl.deleteExit(this.id);
    }

    /**
     * Get the controlled character this exit is in the room of.
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(ctrl => ctrl.inRoom.exits.hasKey(this.id), true);
    }

    /**
     * Get the details of the exit.
     * @roomOwnershipRequired
     * @calls {@link ResClient.get}
     */
    async getDetails(): Promise<ExitDetails> {
        return this.api.get<ExitDetails>(ResourceIDs.EXIT_DETAILS({ id: this.id }));
    }

    /**
     * Get the room for the exit. A controlled character must be in the room.
     * @calls {@link getCtrl} > {@link ResClient.get}
     */
    async getRoom(): Promise<Room> {
        const ctrl = await this.getCtrl();
        return this.api.get<Room>(ResourceIDs.ROOM({ id: ctrl.inRoom.id }));
    }

    /**
     * Get the detailed room for the exit. A controlled character must be in the room.
     * @calls {@link getCtrl}
     */
    async getRoomDetails(): Promise<RoomDetails> {
        const ctrl = await this.getCtrl();
        return ctrl.inRoom;
    }

    /**
     * Use this exit.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @calls {@link ControlledCommands.useExit}
     */
    async use(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.useExit(ctrl, { exitId: this.id });
    }
}

export default Exit;
