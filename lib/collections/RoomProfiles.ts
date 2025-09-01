import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type RoomProfile from "../models/RoomProfile.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Room from "../models/Room.js";
import type RoomDetails from "../models/RoomDetails.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The profiles in a room.
 * @resourceID {@link ResourceIDs.ROOM_PROFILES | ROOM_PROFILES}
 */
export default class RoomProfiles extends BaseCollection<RoomProfile, typeof ResourceIDs.ROOM_PROFILE> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.ROOM_PROFILE
        });
    }

    get roomId(): string {
        return ResourceIDs.ROOM_PROFILES.parts(this.rid).id;
    }

    /**
     * Create a profile based on the room's current attributes. You must be present in the room.
     * @param name The name of the profile.
     * @param key The key of the profile.
     * @roomOwnershipRequired
     */
    async create(name: string, key: string): Promise<RoomProfile> {
        const ctrl = await this.getCtrl();
        return ctrl.createRoomProfile(name, key);
    }

    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(ctrl => ctrl.ownedRooms.hasKey(this.roomId) && ctrl.inRoom.id === this.roomId, true);
    }

    /**
     * Get the room for the profiles.
     */
    async getRoom(): Promise<Room> {
        return this.api.get<Room>(ResourceIDs.ROOM({ id: this.roomId }));
    }

    /**
     * Get the detailed room for the profiles. A character must be in the room.
     */
    async getRoomDetails(): Promise<RoomDetails> {
        return this.api.get<RoomDetails>(ResourceIDs.ROOM_DETAILS({ id: this.roomId }));
    }
}
