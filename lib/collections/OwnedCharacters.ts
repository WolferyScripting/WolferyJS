import BaseCollection from "./BaseCollection.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Commands from "../util/commands.js";
import type Player from "../models/Player.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The characters owned by the player.
 * @resourceID {@link ResourceIDs.OWNED_CHARACTERS | OWNED_CHARACTERS}
 */
export default class OwnedCharacters extends BaseCollection<OwnedCharacter, typeof ResourceIDs.OWNED_CHARACTER> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.OWNED_CHARACTER
        });
    }

    get playerId(): string {
        return ResourceIDs.OWNED_CHARACTERS.parts(this.rid).id;
    }

    /**
     * Create a new character.
     * @param options The options for creating the character.
     * @playerRequired
     * @calls {@link getPlayer} > {@link Player.createChar}
     */
    async create(options: Commands.Player.CreateCharOptions): Promise<OwnedCharacter> {
        const player = await this.getPlayer();
        return player.createChar(options);
    }

    /**
     * Get the player these characters are for.
     * @calls {@link CoreCommands.getPlayer}
     */
    async getPlayer(): Promise<Player> {
        const player = await this.client.commands.core.getPlayer();
        if (player.id !== this.playerId) {
            throw new Error(`Authenticated player id ${player.id} does not match collection player id ${this.playerId}`);
        }
        return player;
    }
}
