import Base from "./Base.js";
import type OwnedAreas from "../collections/OwnedAreas.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type OwnedRooms from "../collections/OwnedRooms.js";
import { type BasicCharacterResponse, type CharacterType } from "../util/types.js";
import type Character from "../models/Character.js";

export default class BuilderCommands extends Base {
    /**
     * Get a character's owned areas. Requires the builder role if you do not own the character.
     * @param charId The ID of the character to get the owned areas of.
     * @builderRoleRequired
     */
    async getOwnedAreas(charId: string): Promise<OwnedAreas> {
        return this.client.api.get(ResourceIDs.OWNED_AREAS({ id: charId }));
    }

    /**
     * Get a character's owned rooms. Requires the builder role if you do not own the character.
     * @param charId The ID of the character to get the owned rooms of.
     * @builderRoleRequired
     */
    async getOwnedRooms(charId: string): Promise<OwnedRooms> {
        return this.client.api.get(ResourceIDs.OWNED_ROOMS({ id: charId }));
    }

    /**
     * Set a character's type.
     * @param charId The ID of the character to set the type of.
     * @param type The type to set.
     * @builderRoleRequired
     */
    async setCharType(charId: string, type: CharacterType): Promise<Character> {
        return this.client.commands.core.getPlayer().then(player => player.call<BasicCharacterResponse<"char">>("setChar", { charId, type }).then(r => player.basicChar(r, "char")));
    }

    /**
     * Undelete an area.
     * @param areaId The ID of the area to delete.
     * @param ownerId The ID of the character to make the owner of the undeleted area. Defaults to the original owner.
     * @builderRoleRequired
     */
    async undeleteArea(areaId: string, ownerId?: string): Promise<unknown> {
        return this.client.commands.core.getPlayer().then(player => player.call("undeleteArea", { areaId, ownerId }));
    }

    /**
     * Undelete an exit.
     * @param exitId The ID of the exit to delete.
     * @param keys The keys of the exit to undelete. @TODO
     * @param ownerId The ID of the character to make the owner of any undeleted rooms or areas. Defaults to the original owner.
     * @builderRoleRequired
     */
    async undeleteExit(exitId: string, keys?: Array<string>, ownerId?: string): Promise<unknown> {
        return this.client.commands.core.getPlayer().then(player => player.call("undeleteExit", { exitId, keys, ownerId }));
    }

    /**
     * Undelete a room.
     * @param roomId The ID of the room to delete.
     * @param ownerId The ID of the character to make the owner of the undeleted room. Defaults to the original owner.
     * @builderRoleRequired
     */
    async undeleteRoom(roomId: string, ownerId?: string): Promise<unknown> {
        return this.client.commands.core.getPlayer().then(player => player.call("undeleteRoom", { roomId, ownerId }));
    }

    // @TODO getDeletedAreaRooms, getDeletedCharAreas, getDeletedCharRooms, getDeletedRoomExits
}
