import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type Character from "./Character.js";
import type WolferyJS from "../WolferyJS.js";
import type { AreaDetailsProperties } from "../generated/models/types.js";
import { AreaDetailsDefinition } from "../generated/models/definitions.js";
import type { DeleteNameResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import { NoControlledError } from "../util/Errors.js";
import type { ResClient } from "resclient-ts";

declare interface AreaDetails extends BaseModel, AreaDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A detailed area, seen by a controlled character.
 * @resourceID {@link ResourceIDs.AREA_DETAILS | AREA_DETAILS}
 */
class AreaDetails extends BaseModel implements AreaDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: AreaDetailsDefinition });
    }

    /**
     * Delete this area.
     * @areaOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.deleteArea} > {@link ControlledCommands.deleteArea}
     */
    async delete(): Promise<DeleteNameResponse> {
        const ctrl = await this.getCtrl();
        return ctrl.deleteArea(this.id);
    }

    /**
     * Get the controlled character that owns this area.
     * @areaOwnershipRequired
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        const ctrl = await this.client.findControlledCharacter(c => c.ownedAreas.hasKey(this.id));
        if (!ctrl) throw new NoControlledError(`Failed to get ControlledCharacter owner for area ${this.rid}`);
        return ctrl;
    }

    /**
     * Request to set the owner of this area.
     * @param charId The ID of the character to request to set as the owner.
     * @areaOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.requestSetAreaOwner}
     */
    async requestSetOwner(charId: string): Promise<Character> {
        const ctrl = await this.getCtrl();
        return ctrl.requestSetAreaOwner(this.id, charId);
    }

    /**
     * Request to set the parent of this area.
     * @param areaId The ID of the area to request to set as the parent.
     * @areaOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.requestSetAreaParent}
     */
    async requestSetParent(areaId: string): Promise<null> {
        const ctrl = await this.getCtrl();
        return ctrl.requestSetAreaParent(this.id, areaId);
    }

    /**
     * Set options for this area.
     * @param options The options to set.
     * @areaOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.setArea}
     */
    async set(options: Commands.Controlled.SetAreaOptions): Promise<null> {
        const ctrl = await this.getCtrl();
        return ctrl.setArea(this.id, options);
    }

    /**
     * Set the owner of this area. Unless you own the target character, the `Builder` role is required.
     * @param charId The ID of the character to set as the owner.
     * @areaOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.setAreaOwner}
     */
    async setOwner(charId: string): Promise<Character> {
        const ctrl = await this.getCtrl();
        return ctrl.setAreaOwner(this.id, charId);
    }
}

export default AreaDetails;
