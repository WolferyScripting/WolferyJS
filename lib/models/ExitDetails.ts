import BaseModel from "./BaseModel.js";
import type Exit from "./Exit.js";
import type Room from "./Room.js";
import type RoomDetails from "./RoomDetails.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { ExitDetailsProperties } from "../generated/models/types.js";
import { ExitDetailsDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface ExitDetails extends BaseModel, ExitDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A detailed exit.
 * @resourceID {@link ResourceIDs.EXIT_DETAILS | EXIT_DETAILS}
 */
class ExitDetails extends BaseModel implements ExitDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ExitDetailsDefinition });
    }

    /**
     * Delete the exit. The controlled character that owns the room must be in the room.
     * @roomOwnershipRequired
     */
    async delete(): Promise<Exit> {
        const ctrl = await this.client.findControlledCharacter(c => c.inRoom.exits.hasKey(this.id), true);
        return ctrl.deleteExit(this.id);
    }

    async getExit(): Promise<Exit> {
        return this.api.get<Exit>(ResourceIDs.EXIT({ id: this.id }));
    }

    /**
     * Get the room for the exit. A controlled character must be in the room.
     */
    async getRoom(): Promise<Room> {
        const ctrl = await this.client.findControlledCharacter(c => c.inRoom.exits.hasKey(this.id), true);
        return this.api.get<Room>(ResourceIDs.ROOM({ id: ctrl.inRoom.id }));
    }

    /**
     * Get the detailed room for the profiles. A controlled character must be in the room.
     */
    async getRoomDetails(): Promise<RoomDetails> {
        const ctrl = await this.client.findControlledCharacter(c => c.inRoom.exits.hasKey(this.id), true);
        return ctrl.inRoom;
    }

    /**
     * Use this exit.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     */
    async use(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.useExit(ctrl, { exitId: this.id });
    }
}

export default ExitDetails;
