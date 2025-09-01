import type ControlledCharacter from "./ControlledCharacter.js";
import BaseModel from "./BaseModel.js";
import type Room from "./Room.js";
import type RoomDetails from "./RoomDetails.js";
import type WolferyJS from "../WolferyJS.js";
import type { NameBasicResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import type { RoomProfileProperties } from "../generated/models/types.js";
import { RoomProfileDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface RoomProfile extends BaseModel, RoomProfileProperties {}
// do not edit the first line of the class comment
/**
 * A profile of a room.
 * @resourceID {@link ResourceIDs.ROOM_PROFILE | ROOM_PROFILE}
 */
class RoomProfile extends BaseModel implements RoomProfileProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomProfileDefinition });
    }

    get imageURL(): string | null {
        return this.image === "" ? null : `${this.client.fileURL}/core/room/img/${this.image}`;
    }

    /**
     * Delete the room profile. The controlled character that owns the room must be in the room.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.deleteRoomProfile}
     */
    async delete(): Promise<NameBasicResponse> {
        const ctrl = await this.getCtrl();
        return ctrl.deleteRoomProfile(this.id);
    }

    /**
     * Get the controlled character in the room containing this profile.
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(async c => c.inRoom.owner.id === c.id && (await c.inRoom.getProfiles()).hasKey(this.id), true);
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
     * Set options for this room profile. The controlled character that owns the room must be in the room.
     * @param options The options to set.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.setRoomProfile}
     */
    async set(options: Commands.Controlled.SetRoomProfileOptions): Promise<NameBasicResponse> {
        const ctrl = await this.getCtrl();
        return ctrl.setRoomProfile(this.id, options);
    }

    /**
     * Apply this room profile. The controlled character that owns the room must be in the room.
     * @param safe If a check should be made to ensure the current room info is stored in a profile.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.useRoomProfile}
     */
    async use(safe = true): Promise<RoomProfile> {
        const ctrl = await this.getCtrl();
        return ctrl.useRoomProfile(this.id, safe);
    }
}

export default RoomProfile;
