import BaseCollectionModel from "./BaseCollectionModel.js";
import CharacterMin from "./CharacterMin.js";
import type WolferyJS from "../WolferyJS.js";
import type { FocusCharsProperties } from "../generated/models/types.js";
import { FocusCharsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface FocusChars extends BaseCollectionModel<CharacterMin>, FocusCharsProperties {}
class FocusChars extends BaseCollectionModel<CharacterMin> implements FocusCharsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, CharacterMin, { definition: FocusCharsDefinition });
    }
}

export default FocusChars;
