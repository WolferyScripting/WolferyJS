import type RoomCharacter from "./RoomCharacter.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type WolferyJS from "../WolferyJS.js";
import type { LookedAtProperties } from "../generated/models/types.js";
import { ResRef, type ResClient } from "resclient-ts";

// key-value (id, true) collection model
interface LookedAt extends BaseCollectionModel<boolean>, LookedAtProperties {}
// do not edit the first line of the class comment
/**
 * The characters looking at an owned character.
 * @resourceID {@link ResourceIDs.LOOKED_AT | LOOKED_AT}
 * @resourceID {@link ResourceIDs.LOOKED_AT_INSTANCE | LOOKED_AT_INSTANCE}
 */
class LookedAt extends BaseCollectionModel<boolean> implements LookedAtProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => typeof item === "boolean");
    }

    protected override _shouldPromoteKey(): boolean {
        return false;
    }

    get refs(): Array<ResRef<RoomCharacter>> {
        return Object.entries(this.props).filter(([,v]) => Boolean(v)).map(([k]) => new ResRef(this.api, ResourceIDs.ROOM_CHARACTER({ id: k })));
    }

    async getChars(): Promise<Array<RoomCharacter>> {
        return Promise.all(this.refs.map(ref => ref.get()));
    }
}

export default LookedAt;
