import BaseCollection from "./BaseCollection.js";
import type Area from "../models/Area.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The areas owned by a character.
 * @resourceID {@link ResourceIDs.OWNED_AREAS | OWNED_AREAS}
 */
export default class OwnedAreas extends BaseCollection<Area, typeof ResourceIDs.AREA> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.AREA
        });
    }

    get ctrlId(): string {
        return ResourceIDs.OWNED_AREAS.parts(this.rid).id;
    }

    /**
     * Create a new area.
     * @param name The name of the area.
     */
    async create(name: string): Promise<Area> {
        const ctrl = await this.getCtrl();
        return ctrl.createArea(name);
    }

    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.getControlledCharacter(this.ctrlId, true);
    }
}
