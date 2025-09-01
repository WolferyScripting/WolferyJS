import BaseCollection from "./BaseCollection.js";
import type Room from "../models/Room.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The rooms owned by a character.
 * @resourceID {@link ResourceIDs.OWNED_ROOMS | OWNED_ROOMS}
 */
export default class OwnedRooms extends BaseCollection<Room, typeof ResourceIDs.ROOM> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.ROOM
        });
    }

    get ctrlId(): string {
        return ResourceIDs.OWNED_ROOMS.parts(this.rid).id;
    }

    /**
     * Create a new room.
     * @param name The name of the room.
     */
    async create(name: string): Promise<Room> {
        const ctrl = await this.getCtrl();
        return ctrl.createRoom(name);
    }

    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.getControlledCharacter(this.ctrlId, true);
    }
}
