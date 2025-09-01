import BaseModel from "./BaseModel.js";
import type RoomScriptDetails from "./RoomScriptDetails.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type Room from "./Room.js";
import type RoomDetails from "./RoomDetails.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { RoomScriptProperties } from "../generated/models/types.js";
import { RoomScriptDefinition } from "../generated/models/definitions.js";
import { type KeyBasicResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

declare interface RoomScript extends BaseModel, RoomScriptProperties {}
// do not edit the first line of the class comment
/**
 * A room script.
 * @resourceID {@link ResourceIDs.ROOM_SCRIPT | ROOM_SCRIPT}
 */
class RoomScript extends BaseModel implements RoomScriptProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomScriptDefinition });
    }

    /**
     * Delete the room script. The controlled character that owns the room must be in the room.
     * @roomOwnershipRequired
     */
    async delete(): Promise<KeyBasicResponse> {
        const ctrl = await this.getCtrl();
        return ctrl.deleteRoomScript(this.id);
    }

    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(async c => c.inRoom.owner.id === c.id && (await c.inRoom.getScripts()).hasKey(this.id), true);
    }

    async getDetails(): Promise<RoomScriptDetails> {
        return this.api.get<RoomScriptDetails>(ResourceIDs.ROOM_SCRIPT_DETAILS({ id: this.id }));
    }

    /**
     * Get the room for the room profile. A controlled character must be in the room.
     */
    async getRoom(): Promise<Room> {
        const ctrl = await this.getCtrl();
        return this.api.get<Room>(ResourceIDs.ROOM({ id: ctrl.inRoom.id }));
    }

    /**
     * Get the detailed room for the room profile. A controlled character must be in the room.
     */
    async getRoomDetails(): Promise<RoomDetails> {
        const ctrl = await this.getCtrl();
        return ctrl.inRoom;
    }

    /**
     * Set options for this room script. The controlled character that owns the room must be in the room.
     * @param options The options to set.
     * @roomOwnershipRequired
     */
    async set(options: Commands.Controlled.SetRoomScriptOptions): Promise<{ room: Room; script: RoomScriptDetails; }> {
        const ctrl = await this.getCtrl();
        return ctrl.setRoomScript(this.id, options);
    }
}

export default RoomScript;
