import type ControlledCharacter from "./ControlledCharacter.js";
import BaseModel from "./BaseModel.js";
import type ExitDetails from "./ExitDetails.js";
import type WolferyJS from "../WolferyJS.js";
import type { ExitProperties } from "../generated/models/types.js";
import { ExitDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface Exit extends BaseModel, ExitProperties {}
// do not edit the first line of the class comment
/**
 * An exit.
 * @resourceID {@link ResourceIDs.EXIT | EXIT}
 */
class Exit extends BaseModel implements ExitProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ExitDefinition });
    }

    /**
     * Get the details of the exit.
     * @roomOwnershipRequired
     */
    async getDetails(): Promise<ExitDetails> {
        return this.api.get<ExitDetails>(ResourceIDs.EXIT_DETAILS({ id: this.id }));
    }

    async use(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.useExit(this.id);
    }
}

export default Exit;
