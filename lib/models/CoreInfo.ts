import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { CoreInfoProperties } from "../generated/models/types.js";
import { CoreInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface CoreInfo extends BaseModel, CoreInfoProperties {}
// do not edit the first line of the class comment
/**
 * The core info about the realm.
 * @resourceID CORE_INFO(core.info)
 */
class CoreInfo extends BaseModel implements CoreInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: CoreInfoDefinition });
    }
}

export default CoreInfo;
