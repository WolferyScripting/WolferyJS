import BaseModel from "./BaseModel.js";
import type RoomScript from "./RoomScript.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type Room from "./Room.js";
import type RoomDetails from "./RoomDetails.js";
import { type KeyBasicResponse } from "../util/types.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import { RoomScriptDetailsDefinition } from "../generated/models/definitions.js";
import type { RoomScriptDetailsProperties } from "../generated/models/types.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

declare interface RoomScriptDetails extends BaseModel, RoomScriptDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A detailed room script.
 * @resourceID {@link ResourceIDs.ROOM_SCRIPT_DETAILS | ROOM_SCRIPT_DETAILS}
 */
class RoomScriptDetails extends BaseModel implements RoomScriptDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomScriptDetailsDefinition });
    }

    /**
     * Delete the room script. The controlled character that owns the room must be in the room.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.deleteRoomScript}
     */
    async delete(): Promise<KeyBasicResponse> {
        const ctrl = await this.getCtrl();
        return ctrl.deleteRoomScript(this.id);
    }

    /**
     * Get the controlled character in the room containing this script.
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(async c => c.inRoom.owner.id === c.id && (await c.inRoom.getScripts()).hasKey(this.id), true);
    }

    /**
     * Get the room for the room profile. A controlled character must be in the room.
     * @calls {@link getCtrl} > {@link ResClient.get}
     */
    async getRoom(): Promise<Room> {
        const ctrl = await this.getCtrl();
        return this.api.get<Room>(ResourceIDs.ROOM({ id: ctrl.inRoom.id }));
    }

    /**
     * Get the detailed room for the room profile. A controlled character must be in the room.
     * @calls {@link getCtrl}
     */
    async getRoomDetails(): Promise<RoomDetails> {
        const ctrl = await this.getCtrl();
        return ctrl.inRoom;
    }

    /**
     * Get the room script.
     * @calls {@link ResClient.get}
     */
    async getRoomScript(): Promise<RoomScript> {
        return this.api.get<RoomScript>(ResourceIDs.ROOM_SCRIPT({ id: this.id }));
    }

    /**
     * Set options for this room script. The controlled character that owns the room must be in the room.
     * @param options The options to set.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.setRoomScript}
     */
    async set(options: Commands.Controlled.SetRoomScriptOptions): Promise<{ room: Room; script: RoomScriptDetails; }> {
        const ctrl = await this.getCtrl();
        return ctrl.setRoomScript(this.id, options);
    }
}

export default RoomScriptDetails;
