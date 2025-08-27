import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { NoticeProperties } from "../generated/models/types.js";
import { NoticeDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Notice extends BaseModel, NoticeProperties {}
// do not edit the first line of the class comment
/**
 * A notice. @TODO Have not been able to inspect a notice, so the rid and full properties are not known
 * @resourceID {@link ResourceIDs.NOTICE | NOTICE}
 */
class Notice extends BaseModel implements NoticeProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: NoticeDefinition });
    }

    /** Mark this notice as read. */
    async read(): Promise<null> {
        // @TODO confirm response
        return this.call<null>("read");
    }
}

export default Notice;
