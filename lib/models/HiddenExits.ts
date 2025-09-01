import BaseCollectionModel from "./BaseCollectionModel.js";
import Exit from "./Exit.js";
import type Room from "./Room.js";
import type RoomDetails from "./RoomDetails.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The hidden exits in a room.
 * @resourceID {@link ResourceIDs.HIDDEN_EXITS | HIDDEN_EXITS}
 */
class HiddenExits extends BaseCollectionModel<Exit, typeof ResourceIDs.EXIT> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof Exit, {
            ridConstructor: ResourceIDs.EXIT
        });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("hiddenExits"));
    }

    get roomId(): string {
        return ResourceIDs.HIDDEN_EXITS.parts(this.rid).id;
    }

    /**
     * Create an exit to another room.
     * @param name The name of the exit.
     * @param keys The keys to use to go through the exit.
     * @param targetRoom The ID of the room to go to. Provide `null` to create a new room.
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.createExit}
     */
    async create(name: string, keys: Array<string>, targetRoom: string | null): Promise<{ exit: Exit; targetRoom: Room; }> {
        const ctrl = await this.getCtrl();
        return ctrl.createExit(name, keys, targetRoom);
    }

    /**
     * Get the controlled character that owns the room.
     * @roomOwnershipRequired
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(ctrl => ctrl.ownedRooms.hasKey(this.roomId) && ctrl.inRoom.id === this.roomId, true);
    }

    /**
     * Get the room for the exits.
     * @calls {@link ResClient.get}
     */
    async getRoom(): Promise<Room> {
        return this.api.get<Room>(ResourceIDs.ROOM({ id: this.roomId }));
    }

    /**
     * Get the detailed room for the exits. A character must be in the room.
     * @calls {@link ResClient.get}
     */
    async getRoomDetails(): Promise<RoomDetails> {
        return this.api.get<RoomDetails>(ResourceIDs.ROOM_DETAILS({ id: this.roomId }));
    }

    /**
     * Request to create an exit.
     * @param name The name of the exit.
     * @param keys The keys to use for the exit.
     * @param targetRoom The ID of the room the exit leads to
     * @roomOwnershipRequired
     * @calls {@link getCtrl} > {@link ControlledCharacter.requestCreateExit}
     */
    async requestCreateExit(name: string, keys: Array<string>, targetRoom: string): Promise<{ exit: Exit; room: Room; }> {
        const ctrl = await this.getCtrl();
        return ctrl.requestCreateExit(name, keys, targetRoom);
    }
}

export default HiddenExits;
