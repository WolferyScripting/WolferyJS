import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { CharacterInfoProperties } from "../generated/models/types.js";
import { CharacterInfoDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface CharacterInfo extends BaseModel, CharacterInfoProperties {}
class CharacterInfo extends BaseModel implements CharacterInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: CharacterInfoDefinition });
    }
}

export default CharacterInfo;
