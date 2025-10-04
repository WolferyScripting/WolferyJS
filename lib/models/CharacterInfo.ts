import BaseModel from "./BaseModel.js";
import type Character from "./Character.js";
import type WolferyJS from "../WolferyJS.js";
import type { CharacterInfoProperties } from "../generated/models/types.js";
import { CharacterInfoDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface CharacterInfo extends BaseModel, CharacterInfoProperties {}
// do not edit the first line of the class comment
/**
 * Extra info about a character.
 * @resourceID {@link ResourceIDs.CHARACTER_INFO | CHARACTER_INFO}
 */
class CharacterInfo extends BaseModel implements CharacterInfoProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: CharacterInfoDefinition });
    }

    /**
     * Get the character.
     * @calls {@link MiscCommands.getChar}
     */
    async getChar(): Promise<Character> {
        const charId = ResourceIDs.CHARACTER_INFO.parts(this.rid).id;
        return this.client.commands.misc.getChar(charId);
    }
}

export default CharacterInfo;
