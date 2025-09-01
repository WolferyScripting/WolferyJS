import BaseModel from "./BaseModel.js";
import type OwnedCharacter from "./OwnedCharacter.js";
import type Character from "./Character.js";
import type WolferyJS from "../WolferyJS.js";
import type { WatchProperties } from "../generated/models/types.js";
import { WatchDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface Watch extends BaseModel, WatchProperties {}
// do not edit the first line of the class comment
/**
 * A watched character.
 * @resourceID {@link ResourceIDs.WATCH | WATCH}
 */
class Watch extends BaseModel implements WatchProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: WatchDefinition });
    }

    get charId(): string {
        return ResourceIDs.WATCH.parts(this.rid).char;
    }

    get playerId(): string {
        return ResourceIDs.WATCH.parts(this.rid).player;
    }

    /**
     * Get the character.
     * @calls {@link WolferyJS.getChar}
     */
    async getChar(): Promise<Character> {
        return this.client.getChar(this.charId);
    }

    /**
     * Get the watchers.
     * @calls {@link CoreCommands.getPlayer} > {@link OwnedCharacters.getOrThrow}
     */
    async getWatchers(): Promise<Array<OwnedCharacter>> {
        return this.client.commands.core.getPlayer().then(player => this.watchers.map(id => player.chars.getOrThrow(id)));
    }

    /**
     * Unwatch the character.
     * @calls {@link PlayerCommands.unwatchChar} > {@link WolferyJS.getChar}
     */
    async unwatch(): Promise<Character> {
        return this.client.commands.player.unwatchChar(this.playerId, this.charId)
            .then(r => this.client.getChar(r.id));
    }
}

export default Watch;
