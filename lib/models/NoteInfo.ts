import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { NoteInfoProperties } from "../generated/models/types.js";
import { NoteInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface NoteInfo extends BaseModel, NoteInfoProperties {}
// do not edit the first line of the class comment
/**
 * The note info.
 * @resourceID {@link ResourceIDs.NOTE_INFO | NOTE_INFO}
 */
class NoteInfo extends BaseModel implements NoteInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: NoteInfoDefinition });
    }
}

export default NoteInfo;
