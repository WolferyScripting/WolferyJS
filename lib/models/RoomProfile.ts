import type ControlledCharacter from "./ControlledCharacter.js";
import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { NameBasicResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import type { RoomProfileProperties } from "../generated/models/types.js";
import { RoomProfileDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface RoomProfile extends BaseModel, RoomProfileProperties {}
// do not edit the first line of the class comment
/**
 * A profile of a room.
 */
class RoomProfile extends BaseModel implements RoomProfileProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomProfileDefinition });
    }

    get imageURL(): string | null {
        return this.image === "" ? null : `${this.client.fileURL}/core/room/img/${this.image}`;
    }

    /**
     * Delete this room profile. The character which owns the room must be awake and in the room.
     * @param ctrl The controlled character which is present in the room.
     */
    async delete(ctrl: ControlledCharacter): Promise<Record<"profile", NameBasicResponse>> {
        return ctrl.deleteRoomProfile(this.id);
    }

    /**
     * Set options for this room profile. The character which owns the room must be awake and in the room.
     * @param ctrl The controlled character which is present in the room.
     * @param options The options to set.
     */
    async set(ctrl: ControlledCharacter, options: Commands.ControlledCharacter.SetRoomProfileOptions): Promise<Record<"profile", NameBasicResponse>> {
        return ctrl.setRoomProfile(this.id, options);
    }

    /**
     * Apply this room profile. The character which owns the room must be awake and in the room.
     * @param ctrl The controlled character which is present in the room.
     * @param safe If a check should be made to ensure the current room info is stored in a profile.
     */
    async use(ctrl: ControlledCharacter, safe = true): Promise<Record<"profile", NameBasicResponse>> {
        return ctrl.useRoomProfile(this.id, safe);
    }
}

export default RoomProfile;
