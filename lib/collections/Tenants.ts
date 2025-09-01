import BaseCollection from "./BaseCollection.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type CharacterMin from "../models/CharacterMin.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Room from "../models/Room.js";
import type RoomDetails from "../models/RoomDetails.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type Character from "../models/Character.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The characters that have their home set in a room.
 * @resourceID {@link ResourceIDs.TENANTS | TENANTS}
 */
export default class Tenants extends BaseCollection<CharacterMin, typeof ResourceIDs.CHARACTER_MIN> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.CHARACTER_MIN
        });
    }

    get roomId(): string {
        return ResourceIDs.TENANTS.parts(this.rid).id;
    }

    /**
     * Evict a character.
     * @param charId The ID of the character to evict.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.evictHome}
     */
    async evict(charId: string): Promise<Character> {
        const ctrl = await this.getCtrl();
        return ctrl.evictHome(charId);
    }

    /**
     * Get the controlled character that owns the room.
     * @roomOwnershipRequired
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        const room = await this.getRoom();
        return this.client.findControlledCharacter(ctrl => ctrl.ownedRooms.hasKey(room.id) && ctrl.inRoom.id === room.id, true);
    }

    /**
     * Get the room for these tenants.
     * @calls {@link ResClient.get}
     */
    async getRoom(): Promise<Room> {
        return this.client.api.get<Room>(ResourceIDs.ROOM({ id: this.roomId }));
    }

    /**
     * Get the detailed room for these tenants. A controlled character must be in the room.
     * @calls {@link ResClient.get}
     */
    async getRoomDetails(): Promise<RoomDetails> {
        return this.client.api.get<RoomDetails>(ResourceIDs.ROOM_DETAILS({ id: this.roomId }));
    }
}
