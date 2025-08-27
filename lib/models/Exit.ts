import type ControlledCharacter from "./ControlledCharacter.js";
import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ExitProperties } from "../generated/models/types.js";
import { ExitDefinition } from "../generated/models/definitions.js";
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

    async use(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.useExit(this.id);
    }
}

export default Exit;
