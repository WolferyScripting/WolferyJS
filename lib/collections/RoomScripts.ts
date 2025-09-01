import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type RoomScript from "../models/RoomScript.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Commands from "../util/commands.js";
import type RoomScriptDetails from "../models/RoomScriptDetails.js";
import type Room from "../models/Room.js";
import type RoomDetails from "../models/RoomDetails.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The scripts in a room.
 * @resourceID {@link ResourceIDs.ROOM_SCRIPTS | ROOM_SCRIPTS}
 */
export default class RoomScripts extends BaseCollection<RoomScript, typeof ResourceIDs.ROOM_SCRIPT> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.ROOM_SCRIPT
        });
    }

    get roomId(): string {
        return ResourceIDs.ROOM_SCRIPTS.parts(this.rid).id;
    }

    /**
     * Create a profile based on the room's current attributes. You must be present in the room.
     * @param key The key of the script.
     * @param options The options for creating the room script.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.createRoomScript}
     */
    async create(key: string, options: Commands.Controlled.CreateRoomScriptOptions): Promise<RoomScriptDetails> {
        const ctrl = await this.getCtrl();
        return ctrl.createRoomScript(key, options);
    }

    /**
     * Get the controlled character that owns the room.
     * @roomOwnershipRequired
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(ctrl => ctrl.ownedRooms.hasKey(this.roomId) && ctrl.inRoom.id === this.roomId, true);
    }

    /**
     * Get the room for the scripts.
     * @calls {@link ResClient.get}
     */
    async getRoom(): Promise<Room> {
        return this.api.get<Room>(ResourceIDs.ROOM({ id: this.roomId }));
    }

    /**
     * Get the detailed room for the scripts. A character must be in the room.
     * @calls {@link ResClient.get}
     */
    async getRoomDetails(): Promise<RoomDetails> {
        return this.api.get<RoomDetails>(ResourceIDs.ROOM_DETAILS({ id: this.roomId }));
    }
}
