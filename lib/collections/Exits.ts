import BaseCollection from "./BaseCollection.js";
import type Exit from "../models/Exit.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type HiddenExits from "../models/HiddenExits.js";
import type RoomDetails from "../models/RoomDetails.js";
import type Room from "../models/Room.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The exits in a room.
 * @resourceID {@link ResourceIDs.EXITS | EXITS}
 */
export default class Exits extends BaseCollection<Exit, typeof ResourceIDs.EXIT> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.EXIT
        });
    }

    get roomId(): string {
        return ResourceIDs.EXITS.parts(this.rid).id;
    }

    /**
     * Create an exit to another room.
     * @param name The name of the exit.
     * @param keys The keys to use to go through the exit.
     * @param targetRoom The ID of the room to go to. Provide `null` to create a new room.
     * @roomOwnershipRequired
     */
    async create(name: string, keys: Array<string>, targetRoom: string | null): Promise<{ exit: Exit; targetRoom: Room; }> {
        const ctrl = await this.getCtrl();
        return ctrl.createExit(name, keys, targetRoom);
    }

    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(ctrl => ctrl.ownedRooms.hasKey(this.roomId) && ctrl.inRoom.id === this.roomId, true);
    }

    /**
     * Get the hidden exits in the same room.
     * @roomOwnershipRequired
     */
    async getHidden(): Promise<HiddenExits> {
        return this.client.commands.misc.getHiddenExits(this.roomId);
    }

    /**
     * Get the room for the exits.
     */
    async getRoom(): Promise<Room> {
        return this.api.get<Room>(ResourceIDs.ROOM({ id: this.roomId }));
    }

    /**
     * Get the detailed room for the exits. A character must be in the room.
     */
    async getRoomDetails(): Promise<RoomDetails> {
        return this.api.get<RoomDetails>(ResourceIDs.ROOM_DETAILS({ id: this.roomId }));
    }

    /**
     * Request to create an exit.
     * @param name The name of the exit.
     * @param keys The keys to use for the exit.
     * @param targetRoom The ID of the room the exit leads to
     * @roomOwnershipRequired
     */
    async requestCreateExit(name: string, keys: Array<string>, targetRoom: string): Promise<{ exit: Exit; room: Room; }> {
        const ctrl = await this.getCtrl();
        return ctrl.requestCreateExit(name, keys, targetRoom);
    }
}
