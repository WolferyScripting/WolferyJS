import BaseModel from "./BaseModel.js";
import type HiddenExits from "./HiddenExits.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type Character from "./Character.js";
import type WolferyJS from "../WolferyJS.js";
import { RoomDetailsDefinition } from "../generated/models/definitions.js";
import type { RoomDetailsProperties } from "../generated/models/types.js";
import type RoomProfiles from "../collections/RoomProfiles.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type RoomScripts from "../collections/RoomScripts.js";
import type Tenants from "../collections/Tenants.js";
import type Teleporters from "../collections/Teleporters.js";
import type Commands from "../util/commands.js";
import type { ResClient, ResModelOptions } from "resclient-ts";

declare interface RoomDetails extends BaseModel, RoomDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A detailed view of a room.
 * @resourceID {@link ResourceIDs.ROOM_DETAILS | ROOM_DETAILS}
 */
class RoomDetails extends BaseModel implements RoomDetailsProperties {
    // eslint-disable-next-line unicorn/no-object-as-default-parameter
    constructor(client: WolferyJS, api: ResClient, rid: string, options: ResModelOptions = { definition: RoomDetailsDefinition }) {
        super(client, api, rid, options);
    }

    /**
     * Delete this rorom.
     * @areaOwnershipRequired
     */
    async delete(): Promise<null> {
        const ctrl = await this.getCtrl();
        return ctrl.deleteRoom(this.id);
    }

    /**
     * Get the controlled character that owns this area.
     * @areaOwnershipRequired
     */
    async getCtrl(): Promise<ControlledCharacter> {
        const ctrl = await this.client.findControlledCharacter(c => c.ownedRooms.hasKey(this.id));
        if (!ctrl) throw new Error(`Failed to get ControlledCharacter owner for room ${this.rid}`);
        return ctrl;
    }

    /**
     * Get the hidden exits in the room.
     * @roomOwnershipRequired
     */
    async getHiddenExits(): Promise<HiddenExits> {
        return this.api.get<HiddenExits>(ResourceIDs.HIDDEN_EXITS({ id: this.id }));
    }

    /**
     * Get the profiles of the room.
     * @roomOwnershipRequired
     */
    async getProfiles(): Promise<RoomProfiles> {
        return this.api.get<RoomProfiles>(ResourceIDs.ROOM_PROFILES({ id: this.id }));
    }

    /**
     * Get the scripts of the room.
     * @roomOwnershipRequired
     */
    async getScripts(): Promise<RoomScripts> {
        return this.api.get<RoomScripts>(ResourceIDs.ROOM_SCRIPTS({ id: this.id }));
    }

    /**
     * Get the characters that have a teleport registered in the room.
     * @param limit The maximum number of teleporters to return.
     * @param page The page of teleporters to return.
     * @roomOwnershipRequired
     */
    async getTeleporters(limit?: number, page?: number): Promise<Teleporters> {
        let rid = ResourceIDs.TELEPORTERS({ id: this.id });
        if (limit !== undefined) {
            page ??= 0;
            rid += `?limit=${limit}&offset=${page * limit}`;
        }
        return this.api.get<Teleporters>(rid);
    }

    /**
     * Get the characters that have their home set to the room.
     * @param limit The maximum number of tenants to return.
     * @param page The page of tenants to return.
     * @roomOwnershipRequired
     */
    async getTenants(limit?: number, page?: number): Promise<Tenants> {
        let rid = ResourceIDs.TENANTS({ id: this.id });
        if (limit !== undefined) {
            page ??= 0;
            rid += `?limit=${limit}&offset=${page * limit}`;
        }
        return this.api.get<Tenants>(rid);
    }

    /**
     * Request to set the area of this room.
     * @param areaId The ID of the area to request to set as the area.
     * @roomOwnershipRequired
     */
    async requestSetArea(areaId: string): Promise<null> {
        const ctrl = await this.getCtrl();
        return ctrl.requestSetRoomArea(this.id, areaId);
    }

    /**
     * Request to set the owner of this room.
     * @param charId The ID of the character to request to set as the owner.
     * @roomOwnershipRequired
     */
    async requestSetOwner(charId: string): Promise<Character> {
        const ctrl = await this.getCtrl();
        return ctrl.requestSetRoomOwner(this.id, charId);
    }

    /**
     * Set options for this room.
     * @param options The options to set.
     * @roomOwnershipRequired
     */
    async set(options: Commands.Controlled.SetRoomOptions): Promise<null> {
        const ctrl = await this.getCtrl();
        return ctrl.setRoom(this.id, options);
    }

    /**
     * Set the owner of this room.
     * @param charId The ID of the character to set as the owner.
     * @roomOwnershipRequired
     * @builderRoleRequired Unless you own the target character.
     */
    async setOwner(charId: string): Promise<Character> {
        const ctrl = await this.getCtrl();
        return ctrl.setRoomOwner(this.id, charId);
    }
}

export default RoomDetails;
