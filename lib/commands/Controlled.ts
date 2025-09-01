import Base from "./Base.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type Commands from "../util/commands.js";
import type {
    Messages,
    CharacterResponse,
    DeleteNameResponse,
    KeyBasicResponse,
    NameBasicResponse,
    LocationType,
    TagPref
} from "../util/types.js";
import type Exit from "../models/Exit.js";
import ResEventObserver from "../util/ResEventObserver.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import { modelId } from "../util/Util.js";
import type CustomTag from "../models/CustomTag.js";
import { fileTypeFromBuffer } from "file-type";

export default class ControlledCommands extends Base {
    private async _convertImage(buffer: Buffer): Promise<string> {
        return `data:${(await fileTypeFromBuffer(buffer))?.mime ?? "application/octet-stream"};base64,${buffer.toString("base64")}`;
    }

    /**
     * Add a new teleport node.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options for the teleport node.
     * @roomOwnershipRequired
     */
    async addTeleport(ctrl: string | ControlledCharacter, options: Commands.Controlled.AddTeleportOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "addTeleport", options);
    }

    /**
     * Address a character. This is the equivalent of the `@` command in the web client.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to address.
     * @param options The options for addressing the character.
     */
    async address(ctrl: string | ControlledCharacter, charId: string, options: Commands.Controlled.AddressOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "address", { charId, ...options });
    }

    /**
     * Set the character as away (afk).
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param status An optional status message.
     */
    async away(ctrl: string | ControlledCharacter, status?: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "away", { status });
    }

    /**
     * Accept a control request.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to accept control for.
     */
    async controlRequestAccept(ctrl: string | ControlledCharacter, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "controlRequestAccept", { charId });
    }

    /**
     * Reject control of a puppet.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to reject control of.
     * @param msg An optional message to include with the rejection.
     */
    async controlRequestReject(ctrl: string | ControlledCharacter, charId: string, msg?: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "controlRequestReject", { charId, msg });
    }

    /**
     * Copy this character's avatar to the profile.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the profile to copy the avatar to.
     * @returns The profile.
     */
    async copyProfileAvatar(ctrl: string | ControlledCharacter, profileId: string): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "copyProfileAvatar", { profile: profileId })
            .then(r => r.profile);
    }

    /**
     * Copy this character's image to the profile.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the profile to copy the image to.
     * @returns The profile.
     */
    async copyProfileImage(ctrl: string | ControlledCharacter, profileId: string): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "copyProfileImage", { profile: profileId })
            .then(r => r.profile);
    }

    /**
     * Create a new area.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param name The name of the area.
     */
    async createArea(ctrl: string | ControlledCharacter, name: string): Promise<NameBasicResponse> {
        return this.client.api.call<NameBasicResponse>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "createArea", { name });
    }

    /**
     * Create an exit to another room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param name The name of the exit.
     * @param keys The keys to use to go through the exit.
     * @param targetRoom The ID of the room to go to. Provide `null` to create a new room.
     * @roomOwnershipRequired
     */
    async createExit(ctrl: string | ControlledCharacter, name: string, keys: Array<string>, targetRoom: string | null): Promise<Record<"exit" | "targetRoom", NameBasicResponse>> {
        return this.client.api.call<Record<"exit" | "targetRoom", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "createExit", { name, keys, targetRoom });
    }

    /**
     * Create a profile based on this character's current attributes.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param name The name of the profile.
     * @param key The key of the profile.
     */
    async createProfile(ctrl: string | ControlledCharacter, name: string, key: string): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "createProfile", { name, key })
            .then(r => r.profile);
    }

    /**
     * Create a room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param name The name of the room.
     */
    async createRoom(ctrl: string | ControlledCharacter, name: string): Promise<NameBasicResponse> {
        return this.client.api.call<NameBasicResponse>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "createRoom", { name });
    }

    /**
     * Create a room profile. You must be present in the room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param name The name of the room profile.
     * @param key The key of the room profile.
     * @roomOwnershipRequired
     */
    async createRoomProfile(ctrl: string | ControlledCharacter, name: string, key: string): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "createRoomProfile", { name, key })
            .then(r => r.profile);
    }

    /**
     * Create a room script. It will be created in the room the character is located in.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param key The key of the room script.
     * @param options The options for the room script.
     * @roomOwnershipRequired
     */
    async createRoomScript(ctrl: string | ControlledCharacter, key: string, options?: Commands.Controlled.CreateRoomScriptOptions): Promise<{ room: NameBasicResponse; script: KeyBasicResponse; }> {
        return this.client.api.call<{ room: NameBasicResponse; script: KeyBasicResponse; }>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "createRoomScript", { key, ...options });
    }

    /**
     * Create a custom tag.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options for creating the tag.
     */
    async createTag(ctrl: string | ControlledCharacter, options: Commands.Controlled.CreateTagOptions): Promise<CustomTag> {
        return this.client.api.call<CustomTag>(ResourceIDs.CHARACTER_TAGS({ id: modelId(ctrl) }), "create", options);
    }

    /**
     * Delete an area.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param areaId The ID of the area to delete.
     * @areaOwnershipRequired
     */
    async deleteArea(ctrl: string | ControlledCharacter, areaId: string): Promise<DeleteNameResponse> {
        return this.client.api.call<DeleteNameResponse>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "deleteArea", { areaId });
    }

    /**
     * Delete an exit.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param exitId The ID of the exit to delete.
     * @roomOwnershipRequired
     */
    async deleteExit(ctrl: string | ControlledCharacter, exitId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "deleteExit", { exitId });
    }

    /**
     * Delete a profile.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the profile to delete.
     */
    async deleteProfile(ctrl: string | ControlledCharacter, profileId: string): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "deleteProfile", { profileId })
            .then(r => r.profile);
    }

    /**
     * Delete a room. You must be in the room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param roomId The ID of the room to delete.
     * @roomOwnershipRequired
     */
    async deleteRoom(ctrl: string | ControlledCharacter, roomId: string): Promise<null> {
        // @TODO: is roomId required?
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "deleteRoom", { roomId });
    }

    /**
     * Delete a room profile. You must own the room, and be present in it.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the room profile to delete.
     * @roomOwnershipRequired
     */
    async deleteRoomProfile(ctrl: string | ControlledCharacter, profileId: string): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "deleteRoomProfile", { profileId })
            .then(r => r.profile);
    }

    /**
     * Delete a room script. You must own the room, and be present in it.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param scriptId The ID of the room script to delete.
     * @roomOwnershipRequired
     */
    async deleteRoomScript(ctrl: string | ControlledCharacter, scriptId: string): Promise<{ room: NameBasicResponse; script: KeyBasicResponse; }> {
        return this.client.api.call<{ room: NameBasicResponse; script: KeyBasicResponse; }>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "deleteRoomScript", { scriptId });
    }

    /**
     * Describe a scene or action.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param msg The message.
     */
    async describe(ctrl: string | ControlledCharacter, msg: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "describe", { msg });
    }

    /**
     * Evict a character from their teleport nodes or home for the current room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to evict.
     * @returns The evicted character.
     * @roomOwnershipRequired
     */
    async evict(ctrl: string | ControlledCharacter, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<Record<"targetChar", CharacterResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "evict", { charId })
            .then(r => r.targetChar);
    }

    /**
     * Evict a character from their home in the current room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to evict.
     * @returns The evicted character.
     * @roomOwnershipRequired
     */
    async evictHome(ctrl: string | ControlledCharacter, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<Record<"char", CharacterResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "evictHome", { charId })
            .then(r => r.char);
    }

    /**
     * Evict a character from controlling a puppet.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to evict.
     * @param puppetId The ID of the puppet to evict.
     * @returns The evicted character and puppet.
     */
    async evictPuppeteer(ctrl: string | ControlledCharacter, charId: string, puppetId: string): Promise<{ char: CharacterResponse; puppet: CharacterResponse; }> {
        return this.client.api.call<Record<"char" | "puppet", CharacterResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "evictPuppeteer", { charId, puppetId });
    }

    /**
     * Evict a character from their teleport node.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to evict.
     * @returns The evicted character.
     * @roomOwnershipRequired
     */
    async evictTeleport(ctrl: string | ControlledCharacter, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<Record<"char", CharacterResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "evictTeleport", { charId })
            .then(r => r.char);
    }

    /**
     * Request to follow a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to follow.
     */
    async follow(ctrl: string | ControlledCharacter, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "follow", { charId });
    }

    /**
     * Get an exit in the current room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options for getting the exit.
     * @returns The exit.
     */
    async getExit(ctrl: string | ControlledCharacter, options: Commands.Controlled.GetExitOptions): Promise<Exit> {
        return this.client.api.call<Exit>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "getExit", options);
    }

    /**
     * Get the log events for this character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param startTime The timestamp to get log events after
     * @returns The log events.
     */
    async getLogEvents(ctrl: string | ControlledCharacter, startTime?: number): Promise<Commands.LogEvents> {
        return this.client.api.call<Commands.LogEvents>("log.events", "get", { charid: modelId(ctrl), startTime });
    }

    /**
     * Send a message to the helpers.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param msg The message.
     */
    async helpme(ctrl: string | ControlledCharacter, msg: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "helpme", { msg });
    }

    /**
     * Request to join a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to join.
     */
    async join(ctrl: string | ControlledCharacter, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "join", { charId });
    }

    /**
     * Request to lead a character.
     * @param charId The ID of the character to lead.
     */
    async lead(ctrl: string | ControlledCharacter, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "lead", { charId });
    }

    /**
     * Look at a character.
     * @param charId The ID of the character to look at.
     */
    async look(ctrl: string | ControlledCharacter, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "look", { charId });
    }

    /**
     * Send a message to a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to send the message to.
     * @param options The options for sending the message.
     */
    async message(ctrl: string | ControlledCharacter, charId: string, options: Commands.Controlled.MessageOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "message", { charId, ...options });
    }

    /**
     * Send an OOC message.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options for the OOC message.
     */
    async ooc(ctrl: string | ControlledCharacter, options: Commands.Controlled.OOCOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "ooc", options);
    }

    /**
     * Send a ping to avoid being released for inactivity.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     */
    async ping(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "ping");
    }

    /**
     * Send a pose message.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options for the pose message.
     */
    async pose(ctrl: string | ControlledCharacter, options: Commands.Controlled.PoseOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "pose", options);
    }

    /**
     * Register a puppet character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to register as a puppet.
     */
    async registerPuppet(ctrl: string | ControlledCharacter, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "registerPuppet", { charId });
    }

    /**
     * Release control of this character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param msg A release message to show.
     */
    async release(ctrl: string | ControlledCharacter, msg?: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "release", { msg });
    }

    /**
     * Remove a location.
     * @param locationId The ID of the location to remove.
     * @param type The type of the location.
     */
    async removeLocation(ctrl: string | ControlledCharacter, locationId: string, type: LocationType): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "removeLocation", { locationId, type });
    }

    /**
     * Remove a teleport node.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param nodeId The ID of the node to remove.
     */
    async removeTeleport(ctrl: string | ControlledCharacter, nodeId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "removeTeleport", { nodeId });
    }

    /**
     * Request to create an exit.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options for the exit.
     * @roomOwnershipRequired
     */
    async requestCreateExit(ctrl: string | ControlledCharacter, options: Commands.Controlled.RequestCreateExitOptions): Promise<Record<"exit" | "targetRoom", NameBasicResponse>> {
        return this.client.api.call<Record<"exit" | "targetRoom", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "requestCreateExit", options);
    }

    /**
     * Request to set the owner of an area.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param areaId The ID of the area to change ownership of.
     * @param charId The ID of the character to set as the new owner.
     * @returns The new owner character.
     * @areaOwnershipRequired
     */
    async requestSetAreaOwner(ctrl: string | ControlledCharacter, areaId: string, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<Record<"newOwner", CharacterResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "requestSetAreaOwner", { areaId, charId })
            .then(r => r.newOwner);
    }

    /**
     * Request to set the parent of an area.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param areaId The ID of the area to change the parent of.
     * @param parentId The ID of the area to set as the new parent.
     * @areaOwnershipRequired
     */
    async requestSetAreaParent(ctrl: string | ControlledCharacter, areaId: string, parentId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "requestSetAreaParent", { areaId, parentId });
    }

    /**
     * Request to set a room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param roomId The ID of the room to set.
     * @param options The options to set.
     * @roomOwnershipRequired
     */
    async requestSetRoom(ctrl: string | ControlledCharacter, roomId: string, options: Commands.Controlled.RequestSetRoomOptions): Promise<null> {
        // yes this is correct, the method is "requestSetRoom" despite requestSetRoomOwner being separate, and requestSetRoom only accepting an area id
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "requestSetRoom", { roomId, ...options });
    }

    /**
     * Request to the the owner of a room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param roomId The ID of the room.
     * @param charId The ID of the new owner.
     * @returns The new owner.
     * @roomOwnershipRequired
     */
    async requestSetRoomOwner(ctrl: string | ControlledCharacter, roomId: string, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<Record<"newOwner", CharacterResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "requestSetRoomOwner", { roomId, charId })
            .then(r => r.newOwner);
    }

    /**
     * Roll dice.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param roll Accepts a number (sides), an array of `[amount, sides]` (e.g. `[2, 6]`), or a string consisting of a combination of dice sets `{amount}d{sides}` (e.g. `2d6`) and equations (e.g. `2d6+3`)
     * @param quiet If true, the roll will not be announced in the room.
     */
    async roll(ctrl: string | ControlledCharacter, roll: number | [amount: number, sides: number] | string, quiet = false): Promise<Messages.Roll> {
        const observer = new ResEventObserver<Messages.Roll>(this.client, ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "out", { once: true, filter: (data): boolean => data.type === "roll" && data.char.id === ctrl });
        if (typeof roll === "number") {
            roll = `1d${roll}`;
        } else if (Array.isArray(roll)) {
            roll = `${roll[0]}d${roll[1]}`;
        }
        const now = Date.now();
        return this.client.api.call<null>(ResourceIDs.ROLLER({ id: modelId(ctrl) }), "roll", { roll, quiet })
            .then(() => observer.get(500).catch(async() => {
                observer.end();
                const logs = await this.getLogEvents(ctrl, now);
                return logs.events.find(l => l.type === "roll" && l.char.id === ctrl) as Messages.Roll;
            }));
    }

    /**
     * Send a message.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param msg The message to send.
     */
    async say(ctrl: string | ControlledCharacter, msg: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "say", { msg });
    }

    /**
     * Set options for an area.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param areaId The ID of the area to set.
     * @param options The options to set.
     * @returns The area.
     * @areaOwnershipRequired
     */
    async setArea(ctrl: string | ControlledCharacter, areaId: string, options: Commands.Controlled.SetAreaOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setArea", { areaId, ...options });
    }

    /**
     * Set the owner of an area.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param areaId The ID of the area to.
     * @param charId The ID of the character to set as owner.
     * @returns The new owner character.
     * @areaOwnershipRequired
     * @builderRoleRequired Unless you own the target character.
     */
    async setAreaOwner(ctrl: string | ControlledCharacter, areaId: string, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<Record<"newOwner", CharacterResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setAreaOwner", { areaId, charId })
            .then(r => r.newOwner);
    }

    /**
     * Set options for a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options to set.
     */
    async setCharacter(ctrl: string | ControlledCharacter, options: Commands.Controlled.SetCharacterOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "set", options);
    }

    /**
     * Set options for an exit. You must own the room, and be present in it.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param exitId The ID of the exit.
     * @param options The options to set.
     * @roomOwnershipRequired
     */
    async setExit(ctrl: string | ControlledCharacter, exitId: string, options: Commands.Controlled.SetExitOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setExit", { exitId, ...options });
    }

    /**
     * Set the order of an exit.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param exitId The ID of the exit.
     * @param order The new order of the exit.
     * @roomOwnershipRequired
     */
    async setExitOrder(ctrl: string | ControlledCharacter, exitId: string, order: number): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setExitOrder", { exitId, order });
    }

    /**
     * Set a character's home to the current room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     */
    async setHome(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setHome");
    }

    /**
     * Set location options.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param locationId The ID of the location.
     * @param type The type of the location.
     * @param options The options to set.
     */
    async setLocation(ctrl: string | ControlledCharacter, locationId: string, type: LocationType, options: Commands.Controlled.SetLocation): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setLocation", { locationId, type, ...options });
    }

    /**
     * Set options for a profile.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the profile to set.
     * @param options The options to set.
     * @returns The profile.
     */
    async setProfile(ctrl: string | ControlledCharacter, profileId: string, options: Commands.Controlled.SetProfileOptions): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setProfile", { profileId, ...options })
            .then(r => r.profile);
    }

    /**
     * Set options for a puppet.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param puppetId The ID of the puppet.
     * @param options The options to set.
     * @returns The puppet.
     */
    async setPuppet(ctrl: string | ControlledCharacter, puppetId: string, options: Commands.Controlled.SetPuppetOptions): Promise<null> {
        // response unconfirmed
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setPuppet", { puppetId, ...options });
    }

    /**
     * Set options for a room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param roomId The ID of the room to set.
     * @param options The options to set.
     * @roomOwnershipRequired
     */
    async setRoom(ctrl: string | ControlledCharacter, roomId: string, options: Commands.Controlled.SetRoomOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setRoom", { roomId, ...options });
    }

    /**
     * Set the owner of a room.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param roomId The ID of the room to set.
     * @param charId The ID of the character to set as owner.
     * @returns The new owner character.
     * @roomOwnershipRequired
     * @builderRoleRequired Unless you own the target character.
     */
    async setRoomOwner(ctrl: string | ControlledCharacter, roomId: string, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<Record<"newOwner", CharacterResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setRoomOwner", { roomId, charId })
            .then(r => r.newOwner);
    }

    /**
     * Set options for a room profile.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the room profile.
     * @param options The options to set.
     * @roomOwnershipRequired
     */
    async setRoomProfile(ctrl: string | ControlledCharacter, profileId: string, options: Commands.Controlled.SetRoomProfileOptions): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setRoomProfile", { profileId, ...options })
            .then(r => r.profile);
    }

    /**
     * Set a room profile image.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the room profile.
     * @param image The image to set. Either a fully qualified base64 url, or a buffer.
     * @roomOwnershipRequired
     */
    async setRoomProfileImage(ctrl: string | ControlledCharacter, profileId: string, image: string | Buffer): Promise<null> {
        if (Buffer.isBuffer(image)) {
            image = await this._convertImage(image);
        }
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setRoomProfileImage", { profileId, dataUrl: image });
    }

    /**
     * Set options for a room script.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param scriptId The ID of the script to set.
     * @param options The options to set.
     * @roomOwnershipRequired
     */
    async setRoomScript(ctrl: string | ControlledCharacter, scriptId: string, options: Commands.Controlled.SetRoomScriptOptions): Promise<{ room: NameBasicResponse; script: KeyBasicResponse; }> {
        return this.client.api.call<{ room: NameBasicResponse; script: KeyBasicResponse; }>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setRoomScript", { scriptId, ...options });
    }

    /**
     * Set tags for a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param tags A key-value object of id to preference or null.
     */
    async setTags(ctrl: string | ControlledCharacter, tags: Record<string, TagPref | null>): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CHARACTER_TAGS({ id: modelId(ctrl) }), "setTags", { tags });
    }

    /**
     * Set a teleport node.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param nodeId The ID of the node.
     * @param options The options for the teleport node.
     */
    async setTeleport(ctrl: string | ControlledCharacter, nodeId: string, options: Commands.Controlled.SetTeleportOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "setTeleport", { nodeId, ...options });
    }

    /**
     * Stop following a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     */
    async stopFollow(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "stopFollow");
    }

    /**
     * Stop leading a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to stop leading. If not provided, stops leading all characters.
     */
    async stopLead(ctrl: string | ControlledCharacter, charId?: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "stopLead", { charId });
    }

    /**
     * Request to summon a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to summon.
     */
    async summon(ctrl: string | ControlledCharacter, charId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "summon", { charId });
    }

    /**
     * Sweep characters out of the room. If no character id is provided, sleeping characters are swept.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of a specific character to sweep. You must own the room.
     */
    async sweep(ctrl: string | ControlledCharacter, charId?: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "sweep", { charId });
    }

    /**
     * Teleport.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options for teleporting.
     */
    async teleport(ctrl: string | ControlledCharacter, options: Commands.Controlled.TeleportOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "teleport", options);
    }

    /**
     * Teleport a character to their home.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     */
    async teleportHome(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "teleportHome");
    }

    /**
     * Sync a profile with your current details.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the profile to sync.
     */
    async updateProfile(ctrl: string | ControlledCharacter, profileId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "updateProfile", { profileId });
    }

    /**
     * Sync a room with its current details.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the room to sync.
     * @roomOwnershipRequired
     */
    async updateRoomProfile(ctrl: string | ControlledCharacter, profileId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "updateRoomProfile", { profileId });
    }

    /**
     * Use an exit.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param options The options for the exit to use.
     */
    async useExit(ctrl: string | ControlledCharacter, options: Commands.Controlled.UseExitOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "useExit", options);
    }

    /**
     * Apply a profile.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the profile to use.
     * @param safe If a check should be made to ensure the character info is stored in a profile.
     */
    async useProfile(ctrl: string | ControlledCharacter, profileId: string, safe: boolean): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "useProfile", { profileId, safe })
            .then(r => r.profile);
    }

    /**
     * Apply a room profile. You must own the room and be in it.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param profileId The ID of the room profile to use.
     * @param safe If a check should be made to ensure the current room info is stored in a profile.
     * @roomOwnershipRequired
     */
    async useRoomProfile(ctrl: string | ControlledCharacter, profileId: string, safe: boolean): Promise<NameBasicResponse> {
        return this.client.api.call<Record<"profile", NameBasicResponse>>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "useRoomProfile", { profileId, safe })
            .then(r => r.profile);
    }

    /**
     * Wake up a character.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param hidden If the character should be hidden from the awake list. Only applicable to bots.
     */
    async wakeup(ctrl: string | ControlledCharacter, hidden?: boolean): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "wakeup", { hidden });
    }

    /**
     * Send a whisper to a character. You must be in the same room as them.
     * @param ctrl A {@link ControlledCharacter} instance or ID.
     * @param charId The ID of the character to whisper to.
     * @param options The options for the whisper.
     */
    async whisper(ctrl: string | ControlledCharacter, charId: string, options: Commands.Controlled.WhisperOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.CONTROLLED_CHARACTER({ id: modelId(ctrl) }), "whisper", { charId, ...options });
    }
}
