import type Watch from "./Watch.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import { type ResClient, ResRef } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * Watched characters.
 * @resourceID {@link ResourceIDs.WATCHES | WATCHES}
 */
class Watches extends BaseCollectionModel<ResRef<Watch>, typeof ResourceIDs.WATCH> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof ResRef, {
            ridConstructor: ResourceIDs.WATCH
        });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("watches"));
    }

    get playerId(): string {
        return ResourceIDs.WATCHES.parts(this.rid).id;
    }

    /**
     * Add a watch for a character.
     * @param charId The ID of the character to add a watch for.
     * @playerRequired
     */
    async watch(charId: string): Promise<Watch> {
        return this.client.commands.player.watchChar(this.playerId, charId)
            .then(() => this.api.get<Watch>(ResourceIDs.WATCH({ player: this.playerId, char: charId })));
    }
}

export default Watches;
