import BaseModel from "./BaseModel.js";
import type RoomCharacter from "./RoomCharacter.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type WolferyJS from "../WolferyJS.js";
import type { LookedAtProperties } from "../generated/models/types.js";
import { LookedAtDefinition } from "../generated/models/definitions.js";
import { ResRef, type ResClient } from "resclient-ts";

// key-value (id, true) collection model
interface LookedAt extends BaseModel, LookedAtProperties {}
// do not edit the first line of the class comment
/**
 * The characters looking at an owned character.
 */
class LookedAt extends BaseModel implements LookedAtProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: LookedAtDefinition });
    }

    protected override _shouldPromoteKey(): boolean {
        return false;
    }

    get list(): Array<ResRef<RoomCharacter>> {
        return Object.entries(this.props).filter(([,v]) => Boolean(v)).map(([k]) => new ResRef(this.api, ResourceIDs.ROOM_CHARACTER({ id: k })));
    }

    async getChars(): Promise<Array<RoomCharacter>> {
        return Promise.all(this.list.map(ref => ref.get()));
    }
}

export default LookedAt;
