import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { LookAtProperties } from "../generated/models/types.js";
import { LookAtDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface LookAt extends BaseModel, LookAtProperties {}
// do not edit the first line of the class comment
/**
 * The character being looked at.
 * @resourceID {@link ResourceIDs.LOOK_AT | LOOK_AT}
 */
class LookAt extends BaseModel implements LookAtProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: LookAtDefinition });
    }

    /**
     * Get the controlled character for this instance.
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(c => c.lookingAt === this, true);
    }

    /**
     * Stop looking at the character.
     * @calls {@link getCtrl} > {@link ControlledCharacter.unlook}
     */
    async unlook(): Promise<null> {
        const ctrl = await this.getCtrl();
        return ctrl.unlook();
    }
}

export default LookAt;
