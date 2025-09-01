import BaseModel from "./BaseModel.js";
import type Character from "./Character.js";
import type WolferyJS from "../WolferyJS.js";
import type { CharacterDetailsProperties } from "../generated/models/types.js";
import { CharacterDetailsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface CharacterDetails extends BaseModel, CharacterDetailsProperties {}
// do not edit the first line of the class comment
/**
 * A character with extra details, seen when looking at a character.
 * @resourceID {@link ResourceIDs.CHARACTER_DETAILS | CHARACTER_DETAILS}
 */
class CharacterDetails extends BaseModel implements CharacterDetailsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: CharacterDetailsDefinition });
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }

    get fullname(): string {
        return `${this.name} ${this.surname}`.trim();
    }

    /**
     * Get the character.
     * @calls {@link MiscCommands.getChar}
     */
    async getChar(): Promise<Character> {
        return this.client.commands.misc.getChar(this.id);
    }
}

export default CharacterDetails;
