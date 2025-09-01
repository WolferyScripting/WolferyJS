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
     * @note The LookAt instance does not specify the controlled character, so this function may be brittle. It will not work if the LookAt instance is not current.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(c => c.lookingAt === this, true);
    }

    /**
     * Stop looking at the character.
     */
    async unlook(): Promise<null> {
        return this.getCtrl().then(ctrl => ctrl.unlook());
    }
}

export default LookAt;
