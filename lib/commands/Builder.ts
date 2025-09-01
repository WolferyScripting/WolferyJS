import Base from "./Base.js";
import type OwnedAreas from "../collections/OwnedAreas.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type OwnedRooms from "../collections/OwnedRooms.js";
import type { CharacterResponse, CharacterType } from "../util/types.js";
import type Player from "../models/Player.js";
import { modelId } from "../util/Util.js";

export default class BuilderCommands extends Base {
    /**
     * Get a character's owned areas.
     * @param charId The ID of the character to get the owned areas of.
     * @builderRoleRequired If you do not own the character.
     * @calls {@link ResClient.get}
     */
    async getOwnedAreas(charId: string): Promise<OwnedAreas> {
        return this.client.api.get(ResourceIDs.OWNED_AREAS({ id: charId }));
    }

    /**
     * Get a character's owned rooms.
     * @param charId The ID of the character to get the owned rooms of.
     * @builderRoleRequired If you do not own the character.
     * @calls {@link ResClient.get}
     */
    async getOwnedRooms(charId: string): Promise<OwnedRooms> {
        return this.client.api.get(ResourceIDs.OWNED_ROOMS({ id: charId }));
    }

    /**
     * Set a character's type.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to set the type of.
     * @param type The type to set.
     * @builderRoleRequired
     * @calls {@link ResClient.call}
     */
    async setCharType(player: string | Player, charId: string, type: CharacterType): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.PLAYER({ id: modelId(player) }), "setChar", { charId, type })
            .then(r => r.char);
    }

    /**
     * Undelete an area.
     * @param player A {@link Player} instance or ID.
     * @param areaId The ID of the area to delete.
     * @param ownerId The ID of the character to make the owner of the undeleted area. Defaults to the original owner.
     * @builderRoleRequired
     * @calls {@link ResClient.call}
     */
    async undeleteArea(player: string | Player, areaId: string, ownerId?: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "undeleteArea", { areaId, ownerId });
    }

    /**
     * Undelete an exit.
     * @param player A {@link Player} instance or ID.
     * @param exitId The ID of the exit to delete.
     * @param keys The keys of the exit to undelete. @TODO
     * @param ownerId The ID of the character to make the owner of any undeleted rooms or areas. Defaults to the original owner.
     * @builderRoleRequired
     * @calls {@link ResClient.call}
     */
    async undeleteExit(player: string | Player, exitId: string, keys?: Array<string>, ownerId?: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "undeleteExit", { exitId, keys, ownerId });
    }

    /**
     * Undelete a room.
     * @param player A {@link Player} instance or ID.
     * @param roomId The ID of the room to delete.
     * @param ownerId The ID of the character to make the owner of the undeleted room. Defaults to the original owner.
     * @builderRoleRequired
     * @calls {@link ResClient.call}
     */
    async undeleteRoom(player: string | Player, roomId: string, ownerId?: string): Promise<unknown> {
        return this.client.api.call<unknown>(ResourceIDs.PLAYER({ id: modelId(player) }), "undeleteRoom", { roomId, ownerId });
    }

    // @TODO getDeletedAreaRooms, getDeletedCharAreas, getDeletedCharRooms, getDeletedRoomExits
}
