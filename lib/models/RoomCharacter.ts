import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { RoomCharacterProperties } from "../generated/models/types.js";
import { RoomCharacterDefinition } from "../generated/models/definitions.js";
import type {  ResClient } from "resclient-ts";

declare interface RoomCharacter extends BaseModel, RoomCharacterProperties {}
class RoomCharacter extends BaseModel implements RoomCharacterProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: RoomCharacterDefinition });
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }
}

export default RoomCharacter;
