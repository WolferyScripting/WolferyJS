import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { CharacterMinProperties } from "../generated/models/types.js";
import { CharacterMinDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface CharacterMin extends BaseModel, CharacterMinProperties {}
// do not edit the first line of the class comment
/**
 * A minimal character, seen in the list of muted and focused characters.
 */
class CharacterMin extends BaseModel implements CharacterMinProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: CharacterMinDefinition });
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }

    get fullname(): string {
        return `${this.name} ${this.surname}`.trim();
    }
}

export default CharacterMin;
