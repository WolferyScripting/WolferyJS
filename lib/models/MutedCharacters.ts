import BaseCollectionModel from "./BaseCollectionModel.js";
import CharacterMin from "./CharacterMin.js";
import type WolferyJS from "../WolferyJS.js";
import type { MutedCharactersProperties } from "../generated/models/types.js";
import { MutedCharactersDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface MutedCharacters extends BaseCollectionModel<CharacterMin>, MutedCharactersProperties {}
class MutedCharacters extends BaseCollectionModel<CharacterMin> implements MutedCharactersProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, CharacterMin, { definition: MutedCharactersDefinition });
    }
}

export default MutedCharacters;
