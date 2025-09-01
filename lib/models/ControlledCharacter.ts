import type Room from "./Room.js";
import type Area from "./Area.js";
import type Profile from "./Profile.js";
import BaseModel from "./BaseModel.js";
import type Character from "./Character.js";
import type Exit from "./Exit.js";
import type RoomProfile from "./RoomProfile.js";
import type OwnedCharacter from "./OwnedCharacter.js";
import type Puppet from "./Puppet.js";
import type RoomCharacter from "./RoomCharacter.js";
import type RoomDetails from "./RoomDetails.js";
import type LookedAt from "./LookedAt.js";
import type FocusChars from "./FocusChars.js";
import type HiddenExits from "./HiddenExits.js";
import type AreaDetails from "./AreaDetails.js";
import type AreaChild from "./AreaChild.js";
import type RoomChild from "./RoomChild.js";
import type RoomScriptDetails from "./RoomScriptDetails.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type {
    KeyBasicResponse,
    NameBasicResponse,
    DeleteNameResponse,
    Messages,
    PublicPopulationUpdate,
    AreaDetailsPopulationUpdate,
    LocationType,
    TagPref
} from "../util/types.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { ControlledCharacterProperties, Tag } from "../generated/models/types.js";
import { ControlledCharacterDefinition } from "../generated/models/definitions.js";
import { PING_DURATION } from "../util/Constants.js";
import type RoomProfiles from "../collections/RoomProfiles.js";
import type RoomScripts from "../collections/RoomScripts.js";
import { kControlledCharacter } from "../util/Util.js";
import { ResRef, type ResClient } from "resclient-ts";

declare interface ControlledCharacter extends BaseModel, ControlledCharacterProperties {}
// do not edit the first line of the class comment
/**
 * A controlled character.
 * @resourceID {@link ResourceIDs.CONTROLLED_CHARACTER | CONTROLLED_CHARACTER}
 * @resourceID {@link ResourceIDs.CONTROLLED_PUPPET | CONTROLLED_PUPPET}
 */
class ControlledCharacter extends BaseModel implements ControlledCharacterProperties {
    private _focusChars!: FocusChars | null;
    private _hiddenExits!: HiddenExits | null;
    private _pingTimeout!: NodeJS.Timeout | null;
    private _roomProfiles!: RoomProfiles | null;
    private _roomScripts!: RoomScripts | null;
    private onAreaChildChange = this._onAreaChildChange.bind(this);
    private onAreaDetailsChange = this._onAreaDetailsChange.bind(this);
    private onChange = this._onChange.bind(this);
    private onExitChange = this._onExitChange.bind(this);
    private onOut = this._onOut.bind(this);
    private onRoomChildChange = this._onRoomChildChange.bind(this);
    private onRoomDetailsChange = this._onRoomDetailsChange.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ControlledCharacterDefinition });
        this.p
            .writable("_focusChars", null)
            .writable("_hiddenExits", null)
            .writable("_pingTimeout", null)
            .writable("_roomProfiles", null)
            .writable("_roomScripts", null)
            .writable("onAreaChildChange", null)
            .writable("onAreaDetailsChange")
            .writable("onChange")
            .writable("onExitChange")
            .writable("onOut")
            .writable("onRoomChildChange", null)
            .writable("onRoomDetailsChange");
    }

    private async _onAreaChildChange(data: Partial<AreaChild>, area: AreaChild): Promise<void> {
        if (data.pop !== undefined) {
            const update: PublicPopulationUpdate = {
                public:    area.pop,
                publicOld: data.pop ?? area.pop
            };
            this.client.emit("area.child.populationChange", this, area, update);
        }
    }

    private async _onAreaDetailsChange(data: Partial<AreaDetails>, area: AreaDetails): Promise<void> {
        if (data.pop !== undefined || data.prv !== undefined) {
            const update: AreaDetailsPopulationUpdate = {
                private:    area.prv,
                privateOld: data.prv ?? area.prv,
                public:     area.pop,
                publicOld:  data.pop ?? area.pop
            };
            this.client.emit("area.details.populationChange", this, area, update);
        }
    }

    // make sure to update trackChanges in _listen if anything is added here
    private async _onChange(data: Partial<this>): Promise<void> {
        if (this.client.anyTracked("lookAt") && data.lookingAt !== undefined) {
            this.client.emit("lookAtChange", this, this.lookingAt?.char ?? null, data.lookingAt?.char ?? null);
        }

        if (this.client.anyTracked("lookedAt") && data.lookedAt !== undefined) {
            this._listenLookedAt(false, data.lookedAt);
            this._listenLookedAt(true, this.lookedAt);
        }

        if (this.client.anyTracked("roomChange") && data.inRoom !== undefined) {
            await this._listenRoom(false, data.inRoom);
            await this._listenRoom(true, this.inRoom);
            this.client.emit("roomChange.details", this, this.inRoom, data.inRoom);
        }
    }

    // make sure to update trackRoomChanges in _listen if anything changes here
    private _onExitChange(data: Partial<Exit>, exit: Exit): void {
        // this.client.emit("exits.change", this, this.inRoom, exit, data);
        if (data.target !== undefined) {
            if (data.target === null) {
                this._listenExit(false, exit);
                this._listenExit(true, exit);
            } else if (this.client.anyTracked("roomCharactersExit") && data.target.awake) {
                this.listeners.remove(data.target.awake, kControlledCharacter(this.id));
            }
        }
    }

    private async _onOut(data: Messages.Any): Promise<void> {
        const sent = "char" in data && this.id === data.char.id;

        if (data.type === "broadcast") return; // do characters even get these?

        if (data.type === "privateDescribe") {
            const target = await this.api.get<Character>(ResourceIDs.CHARACTER({ id: data.target.id }));
            this.client.emit("message", "privateDescribe", sent, this, data.msg, target, data.script);
            return;
        }

        if (data.type === "info") {
            this.client.emit("message", "info", sent, this, data.msg);
            return;
        }

        const char = await this.api.get<Character>(ResourceIDs.CHARACTER({ id: data.char.id }));

        switch (data.type) {
            case "wakeup":
            case "sleep":
            case "leave":
            case "arrive": {
                this.client.emit("message", data.type, sent, this, char, data.msg, data.method);
                break;
            }

            case "travel": {
                this.client.emit("message", "travel", sent, this, char, data.msg, data.targetRoom, data.method);
                break;
            }

            case "say":
            case "pose": {
                this.client.emit("message", data.type, sent, this, char, data.msg);
                break;
            }

            case "ooc": {
                this.client.emit("message", data.type, sent, this, char, data.msg, !!data.pose);
                break;
            }

            case "address":
            case "whisper":
            case "message":
            case "mail": {
                const target = await this.api.get<Character>(ResourceIDs.CHARACTER({ id: data.target.id }));
                this.client.emit("message", data.type, sent, this, char, data.msg, target, !!data.pose, !!data.ooc);
                break;
            }

            case "action":
            case "describe": {
                this.client.emit("message", data.type, sent, this, char, data.msg);
                break;
            }

            case "roll": {
                this.client.emit("message", "roll", sent, this, char, data.total, data.result, !!data.quiet);
                break;
            }
        }
    }

    private async _onRoomChildChange(data: Partial<RoomChild>, room: RoomChild): Promise<void> {
        if (data.pop !== undefined) {
            const update: PublicPopulationUpdate = {
                public:    room.pop,
                publicOld: data.pop
            };
            this.client.emit("room.child.populationChange", this, room, update);
        }
    }

    private async _onRoomDetailsChange(data: Partial<RoomDetails>, room: RoomDetails): Promise<void> {
        if (data.pop !== undefined) {
            const update: PublicPopulationUpdate = {
                public:    room.pop,
                publicOld: data.pop
            };
            this.client.emit("room.details.populationChange", this, room, update);
        }
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        // don't listen to changes if we aren't looking for anything
        const trackChanges = this.client.anyTracked("lookAt", "lookedAt", "roomChange");
        const trackRoomChanges = this.client.anyTracked("hiddenExits", "roomProfiles", "roomScripts", "exits", "population", "roomCommands", "roomCharacters", "roomCharactersExit", "roomProfiles", "roomScripts");
        if (trackChanges) this[m]("change", this.onChange);
        if (this.client.anyTracked("messages")) this[m]("out", this.onOut);
        if (this.client.options.pingCharacters) {
            if (on) {
                this._pingTimeout = setInterval(() => this.ping(),  PING_DURATION);
            } else if (this._pingTimeout) {
                clearInterval(this._pingTimeout);
            }
        }

        if (on) {
            // eslint-disable-next-line unicorn/no-lonely-if
            if (this.client.anyTracked("focusChars") && this.client.anyTracked("focus")) this._focusChars = await this.settings.focus.getChars();
        }

        if (this.client.anyTracked("profiles")) {
            this.listeners.addOrRemove(on, this.profiles, data => this.client.emit("profiles.add", this, data.item), data => this.client.emit("profiles.remove", this, data.item), kControlledCharacter(this.id));
        }
        if (this.client.anyTracked("ownedAreas")) {
            this.listeners.addOrRemove(on, this.ownedAreas, data => this.client.emit("ownedAreas.add", this, data.item), data => this.client.emit("ownedAreas.remove", this, data.item), kControlledCharacter(this.id));
        }
        if (this.client.anyTracked("ownedRooms")) {
            this.listeners.addOrRemove(on, this.ownedRooms, data => this.client.emit("ownedRooms.add", this, data.item), data => this.client.emit("ownedRooms.remove", this, data.item), kControlledCharacter(this.id));
        }
        if (this.client.anyTracked("characterNodes")) {
            this.listeners.addOrRemove(on, this.nodes, data => this.client.emit("characterNodes.add", this, data.item), data => this.client.emit("characterNodes.remove", this, data.item), kControlledCharacter(this.id));
        }
        if (this.client.anyTracked("focus")) {
            this.listeners.addOrRemove(on, this.settings.focus, data => this.client.emit("focus.add", this, data.item, new ResRef(this.api, ResourceIDs.CHARACTER({ id: data.key }))), data => this.client.emit("focus.remove", this, data.item, new ResRef(this.api, ResourceIDs.CHARACTER({ id: data.key }))), kControlledCharacter(this.id));
            if (this.client.anyTracked("focusChars") && this._focusChars) {
                this.listeners.addOrRemove(on, this._focusChars, data => this.client.emit("focusChars.add", this, data.item, this.settings.focus.props[data.item.id]!), data => this.client.emit("focusChars.remove", this, data.item, this.settings.focus.props[data.item.id]!), kControlledCharacter(this.id));
            }
        }

        if (!on) {
            this._focusChars = null;
        }

        if (this.client.anyTracked("lookedAt")) this._listenLookedAt(on, this.lookedAt);
        if (trackRoomChanges) await this._listenRoom(on, this.inRoom);
    }

    // make sure to update trackRoomChanges in _listen if anything changes here
    protected _listenExit(on: boolean, exit: Exit): void {
        const m = on ? "resourceOn" : "resourceOff";
        exit[m]("change", this.onExitChange);
        if (!exit.target?.awake || !this.client.anyTracked("roomCharactersExit")) return;
        this.listeners.addOrRemove(on, exit.target.awake, data => this.client.emit("roomCharacters.exit.add", this, exit.target!, exit, data.item), data => this.client.emit("roomCharacters.exit.remove", this, exit.target!, exit, data.item), kControlledCharacter(this.id));
    }

    protected _listenLookedAt(on: boolean, lookedAt: LookedAt): void {
        this.listeners.addOrRemove(on, lookedAt, async data => {
            const char = await this.api.get<Character>(ResourceIDs.CHARACTER({ id: data.key }));
            this.client.emit("lookedAt.add", this, char);
        }, async data => {
            const char = await this.api.get<Character>(ResourceIDs.CHARACTER({ id: data.key }));
            this.client.emit("lookedAt.remove", this, char);
        }, kControlledCharacter(this.id));
    }

    // make sure to update trackRoomChanges in _listen if anything changes here
    protected async _listenRoom(on: boolean, room: RoomDetails): Promise<void> {
        const m = on ? "resourceOn" : "resourceOff";
        const owner = room.owner.id === this.id;
        if (on) {
            if (this.client.anyTracked("hiddenExits") && owner) this._hiddenExits = await room.getHiddenExits();
            if (this.client.anyTracked("roomProfiles") && owner) this._roomProfiles = await room.getProfiles();
            if (this.client.anyTracked("roomScripts") && owner) this._roomScripts = await room.getScripts();
        }

        if (this.client.anyTracked("exits")) {
            for (const exit of room.exits) {
                this._listenExit(on, exit);
            }
        }

        if (this.client.anyTracked("population")) {
            room[m]("change", this.onRoomDetailsChange);
            if (room.area) {
                room.area[m]("change", this.onAreaDetailsChange);
                for (const child of room.area.children.areas) {
                    child[m]("change", this.onAreaChildChange);
                }
                for (const child of room.area.children.rooms) {
                    child[m]("change", this.onRoomChildChange);
                }
            }
        }
        if (this.client.anyTracked("exits")) {
            this.listeners.addOrRemove(on, room.exits, data => this.client.emit("exits.add", this, room, data.item), data => this.client.emit("exits.remove", this, room, data.item), kControlledCharacter(this.id));
        }
        if (this.client.anyTracked("roomCommands")) {
            this.listeners.addOrRemove(on, room.cmds, data => this.client.emit("roomCommands.add", this, room, data.item), data => this.client.emit("roomCommands.remove", this, room, data.item), kControlledCharacter(this.id));
        }
        if (this.client.anyTracked("roomCharacters") && room.chars) {
            this.listeners.addOrRemove(on, room.chars, data => this.client.emit("roomCharacters.add", this, room, data.item), data => this.client.emit("roomCharacters.remove", this, room, data.item), kControlledCharacter(this.id));
        }
        if (this.client.anyTracked("hiddenExits") && owner && this._hiddenExits) {
            this.listeners.addOrRemove(on, this._hiddenExits, data => this.client.emit("exits.hidden.add", this, room, data.item), data => this.client.emit("exits.hidden.remove", this, room, data.item), kControlledCharacter(this.id));
            for (const exit of this._hiddenExits) {
                this._listenExit(on, exit);
            }
        }
        if (this.client.anyTracked("roomProfiles") && owner && this._roomProfiles) {
            this.listeners.addOrRemove(on, this._roomProfiles, data => this.client.emit("roomProfiles.add", this, room, data.item), data => this.client.emit("roomProfiles.remove", this, room, data.item), kControlledCharacter(this.id));
        }
        if (this.client.anyTracked("roomScripts") && owner && this._roomScripts) {
            this.listeners.addOrRemove(on, this._roomScripts, data => this.client.emit("roomScripts.add", this, room, data.item), data => this.client.emit("roomScripts.remove", this, room, data.item), kControlledCharacter(this.id));
        }

        if (!on) {
            this._hiddenExits = null;
            this._roomProfiles = null;
            this._roomScripts = null;
        }
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }

    get fullname(): string {
        return `${this.name} ${this.surname}`.trim();
    }

    get isPuppet(): boolean {
        return ResourceIDs.CONTROLLED_PUPPET.regex.test(this.rid);
    }

    /**
     * Accept a control request for a character.
     * @param charId The ID of the character to accept control for.
     * @calls {@link ControlledCommands.controlRequestAccept}
     */
    async acceptControlRequest(charId: string): Promise<null> {
        return this.client.commands.controlled.controlRequestAccept(this, charId);
    }

    /**
     * Add a tag to this character.
     * @param tagId The ID of the tag to add.
     * @param pref The preference for the tag.
     * @calls {@link setTags}
     */
    async addTag(tagId: string, pref: TagPref): Promise<null> {
        return this.setTags({ [tagId]: pref });
    }

    /**
     * Add a new teleport node.
     * @param options The options for the teleport node.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.addTeleport}
     */
    async addTeleport(options: Commands.Controlled.AddTeleportOptions): Promise<null> {
        return this.client.commands.controlled.addTeleport(this, options);
    }

    /**
     * Address a character. This is the equivalent of the `@` command in the web client.
     * @param charId The ID of the character to address.
     * @param options The options for addressing the character.
     * @calls {@link ControlledCommands.address}
     */
    async address(charId: string, options: Commands.Controlled.AddressOptions): Promise<null> {
        return this.client.commands.controlled.address(this, charId, options);
    }

    /**
     * Set this character as away (afk).
     * @calls {@link ControlledCommands.away}
     */
    async away(status?: string): Promise<null> {
        return this.client.commands.controlled.away(this, status);
    }

    /**
     * Copy this character's avatar to the profile.
     * @param profileId The ID of the profile to copy the avatar to.
     * @calls {@link ControlledCommands.copyProfileAvatar} > {@link Profiles.getOrThrow}
     */
    async copyProfileAvatar(profileId: string): Promise<Profile> {
        return this.client.commands.controlled.copyProfileAvatar(this, profileId)
            .then(r => this.profiles.getOrThrow(r.id));
    }

    /**
     * Copy this character's image to the profile.
     * @param profileId The ID of the profile to copy the image to.
     * @calls {@link ControlledCommands.copyProfileImage} > {@link Profiles.getOrThrow}
     */
    async copyProfileImage(profileId: string): Promise<Profile> {
        return this.client.commands.controlled.copyProfileImage(this, profileId)
            .then(r => this.profiles.getOrThrow(r.id));
    }

    /**
     * Create a new area.
     * @param name The name of the area.
     * @calls {@link ControlledCommands.createArea} > {@link WolferyJS.waitForCached}
     */
    async createArea(name: string): Promise<Area> {
        return this.client.commands.controlled.createArea(this, name)
            .then(r => this.client.waitForCached<Area>(ResourceIDs.AREA({ id: r.id })));
    }

    /**
     * Create an exit to another room.
     * @param name The name of the exit.
     * @param keys The keys to use to go through the exit.
     * @param targetRoom The ID of the room to go to. Provide `null` to create a new room.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.createExit} > {@link WolferyJS.waitForCached} (x2)
     */
    async createExit(name: string, keys: Array<string>, targetRoom: string | null): Promise<{ exit: Exit; targetRoom: Room; }> {
        return this.client.commands.controlled.createExit(this, name, keys, targetRoom).then(async r => {
            const [exit, room] = await Promise.all([this.client.waitForCached<Exit>(ResourceIDs.EXIT({ id: r.exit.id })), this.client.waitForCached<Room>(ResourceIDs.ROOM({ id: r.targetRoom.id }))]);
            return { exit, targetRoom: room };
        });
    }

    /**
     * Create a profile based on this character's current attributes.
     * @param name The name of the profile.
     * @param key The key of the profile.
     * @calls {@link ControlledCommands.createProfile} > {@link WolferyJS.waitForCached}
     */
    async createProfile(name: string, key: string): Promise<Profile> {
        return this.client.commands.controlled.createProfile(this, name, key)
            .then(r => this.client.waitForCached<Profile>(ResourceIDs.PROFILE({ id: r.id })));
    }

    /**
     * Create a room.
     * @param name The name of the room.
     * @calls {@link ControlledCommands.createRoom} > {@link WolferyJS.waitForCached}
     */
    async createRoom(name: string): Promise<Room> {
        return this.client.commands.controlled.createRoom(this, name)
            .then(r => this.client.waitForCached<Room>(ResourceIDs.ROOM({ id: r.id })));
    }

    /**
     * Create a room profile. You must be present in the room.
     * @param name The name of the room profile.
     * @param key The key of the room profile.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.createRoomProfile} > {@link WolferyJS.waitForCached}
     */
    async createRoomProfile(name: string, key: string): Promise<RoomProfile> {
        return this.client.commands.controlled.createRoomProfile(this, name, key)
            .then(r => this.client.waitForCached<RoomProfile>(ResourceIDs.ROOM_PROFILE({ id: r.id })));
    }

    /**
     * Create a room script. It will be created in the room the character is located in.
     * @param key The key of the room script.
     * @param options The options for the room script.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.createRoomScript} > {@link ResClient.get}
     */
    async createRoomScript(key: string, options?: Commands.Controlled.CreateRoomScriptOptions): Promise<RoomScriptDetails> {
        return this.client.commands.controlled.createRoomScript(this, key, options)
            .then(async r => this.api.get<RoomScriptDetails>(ResourceIDs.ROOM_SCRIPT_DETAILS({ id: r.script.id })));
    }

    /**
     * Create a custom tag.
     * @param options The options for creating the tag.
     * @calls {@link ControlledCommands.createTag}
     */
    async createTag(options: Commands.Controlled.CreateTagOptions): Promise<Tag> {
        return this.client.commands.controlled.createTag(this, options);
    }

    /**
     * Delete an area.
     * @param areaId The ID of the area to delete.
     * @areaOwnershipRequired
     * @calls {@link ControlledCommands.deleteArea}
     */
    async deleteArea(areaId: string): Promise<DeleteNameResponse> {
        return this.client.commands.controlled.deleteArea(this, areaId);
    }

    /**
     * Delete an exit.
     * @param exitId The ID of the exit to delete.
     * @roomOwnershipRequired
     * @calls {@link getExit} > {@link ControlledCommands.deleteExit}
     */
    async deleteExit(exitId: string): Promise<Exit> {
        const exit = await this.getExit({ exitId });
        return this.client.commands.controlled.deleteExit(this, exitId)
            .then(() => exit);
    }

    /**
     * Delete a profile.
     * @param profileId The ID of the profile to delete.
     * @calls {@link ControlledCommands.deleteProfile}
     */
    async deleteProfile(profileId: string): Promise<NameBasicResponse> {
        return this.client.commands.controlled.deleteProfile(this, profileId);
    }

    /**
     * Delete a room. You must be in the room.
     * @param roomId The ID of the room to delete.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.deleteRoom}
     */
    async deleteRoom(roomId: string): Promise<null> {
        return this.client.commands.controlled.deleteRoom(this, roomId);
    }

    /**
     * Delete a room profile. You must own the room, and be present in it.
     * @param profileId The ID of the room profile to delete.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.deleteRoomProfile}
     */
    async deleteRoomProfile(profileId: string): Promise<NameBasicResponse> {
        return this.client.commands.controlled.deleteRoomProfile(this, profileId);
    }

    /**
     * Delete a room script. You must own the room, and be present in it.
     * @param scriptId The ID of the room script to delete.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.deleteRoomScript}
     */
    async deleteRoomScript(scriptId: string): Promise<KeyBasicResponse> {
        return this.client.commands.controlled.deleteRoomScript(this, scriptId)
            .then(r => r.script);
    }

    /**
     * Describe a scene or action.
     * @param msg The message.
     * @calls {@link ControlledCommands.describe}
     */
    async describe(msg: string): Promise<null> {
        return this.client.commands.controlled.describe(this, msg);
    }

    /**
     * Evict a character from their teleport nodes or home for the current room.
     * @param charId The ID of the character to evict.
     * @returns The evicted character.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.evict} > {@link WolferyJS.getChar}
     */
    async evict(charId: string): Promise<Character> {
        return this.client.commands.controlled.evict(this, charId)
            .then(r => this.client.getChar(r.id));
    }

    /**
     * Evict a character from their home in the current room.
     * @param charId The ID of the character to evict.
     * @returns The evicted character.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.evictHome} > {@link WolferyJS.getChar}
     */
    async evictHome(charId: string): Promise<Character> {
        return this.client.commands.controlled.evictHome(this, charId)
            .then(r => this.client.getChar(r.id));
    }

    /**
     * Evict a character from controlling a puppet.
     * @param charId The ID of the character to evict.
     * @param puppetId The ID of the puppet to evict.
     * @returns The evicted character and puppet.
     * @calls {@link ControlledCommands.evictPuppeteer} > {@link WolferyJS.getChar} (x2)
     */
    async evictPuppeteer(charId: string, puppetId: string): Promise<{ char: Character; puppet: Character; }> {
        return this.client.commands.controlled.evictPuppeteer(this, charId, puppetId)
            .then(async r => {
                const [char, puppet] = await Promise.all([
                    this.client.getChar(r.char.id),
                    this.client.getChar(r.puppet.id)
                ]);
                return { char, puppet };
            });
    }

    /**
     * Evict a character from their teleport node.
     * @param charId The ID of the character to evict.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.evictTeleport} > {@link WolferyJS.getChar}
     */
    async evictTeleport(charId: string): Promise<Character> {
        return this.client.commands.controlled.evictTeleport(this, charId)
            .then(r => this.client.getChar(r.id));
    }

    /**
     * Request to follow a character.
     * @param charId The ID of the character to follow.
     * @calls {@link ControlledCommands.follow}
     */
    async follow(charId: string): Promise<null> {
        return this.client.commands.controlled.follow(this, charId);
    }

    /**
     * Get the character for this controlled character.
     * @returns The character.
     * @calls {@link MiscCommands.getChar}
     */
    async getChar(): Promise<Character> {
        return this.client.commands.misc.getChar(this.id);
    }

    /**
     * Get an exit in the current room.
     * @param options The options for getting the exit.
     * @calls {@link ControlledCommands.getExit}
     */
    async getExit(options: Commands.Controlled.GetExitOptions): Promise<Exit> {
        return this.client.commands.controlled.getExit(this, options);
    }

    /**
     * Get the log events for this character.
     * @param startTime The timestamp to get log events after
     * @calls {@link ControlledCommands.getLogEvents}
     */
    async getLogEvents(startTime?: number): Promise<Commands.LogEvents> {
        return this.client.commands.controlled.getLogEvents(this, startTime);
    }

    /**
     * Get the owned character for this controlled character. If the character is a puppet, use {@link getPuppet} instead.
     * @calls {@link ResClient.get}
     */
    async getOwnedChar(): Promise<OwnedCharacter> {
        return this.api.get<OwnedCharacter>(ResourceIDs.OWNED_CHARACTER({ id: this.id }));
    }

    /**
     * Get the puppet for this controlled character. If the character is not a puppet, use {@link getOwnedChar} instead.
     * @returns The puppet.
     * @playerRequired
     * @calls {@link CoreCommands.getPlayer} > {@link Puppets.fetch}
     */
    async getPuppet(): Promise<Puppet> {
        return this.client.commands.core.getPlayer().then(player => player.puppets.fetch(this.puppeteer!.id, this.id));
    }

    /**
     * Get the room character for this controlled character.
     * @returns The room character, or null if the room is dark.
     */
    getRoomChar(): RoomCharacter | null {
        return this.inRoom.chars?.get(this.id) ?? null;
    }

    /**
     * Send a message to the helpers.
     * @param msg The message.
     * @calls {@link ControlledCommands.helpme}
     */
    async helpme(msg: string): Promise<null> {
        return this.client.commands.controlled.helpme(this, msg);
    }

    /**
     * Request to join a character.
     * @param charId The ID of the character to join.
     * @calls {@link ControlledCommands.join}
     */
    async join(charId: string): Promise<null> {
        return this.client.commands.controlled.join(this, charId);
    }

    /**
     * Request to lead a character.
     * @param charId The ID of the character to lead.
     * @calls {@link ControlledCommands.lead}
     */
    async lead(charId: string): Promise<null> {
        return this.client.commands.controlled.lead(this, charId);
    }

    /**
     * Set the LFRP status for the character.
     * @param msg The message to display when LFRP is enabled.
     * @playerRequired if `msg` is set.
     * @calls {@link set}, {@link CoreCommands.getPlayer} > {@link Player.setCharSettings}
     */
    async lfrp(msg?: string): Promise<null> {
        if (msg) {
            await this.client.commands.core.getPlayer().then(player => player.setCharSettings(this.id, { lfrpDesc: msg }));
        }

        return this.set({ rp: "lfrp" });
    }


    /**
     * Look at a character.
     * @param charId The ID of the character to look at.
     * @calls {@link ControlledCommands.look}
     */
    async look(charId: string): Promise<null> {
        return this.client.commands.controlled.look(this, charId);
    }

    /**
     * Send a mail to a character.
     * @param toCharId The ID of the character to send the mail to.
     * @param options The options for the mail.
     * @playerRequired
     * @calls {@link CoreCommands.getPlayer} > {@link Player.mail}
     */
    async mail(toCharId: string, options: Commands.Player.MailOptions): Promise<Character> {
        return this.client.commands.core.getPlayer()
            .then(player => player.mail(this, toCharId, options));
    }

    /**
     * Send a message to a character.
     * @param charId The ID of the character to send the message to.
     * @param options The options for sending the message.
     * @calls {@link ControlledCommands.message}
     */
    async message(charId: string, options: Commands.Controlled.MessageOptions): Promise<null> {
        return this.client.commands.controlled.message(this, charId, options);
    }

    /**
     * Teleport to a node.
     * @param nodeId The ID of the node to teleport to.
     * @calls {@link teleport}
     */
    async nodeTeleport(nodeId: string): Promise<null> {
        return this.teleport({ nodeId });
    }

    /**
     * Send an OOC message.
     * @param options The options for the OOC message.
     * @calls {@link ControlledCommands.ooc}
     */
    async ooc(options: Commands.Controlled.OOCOptions): Promise<null> {
        return this.client.commands.controlled.ooc(this, options);
    }

    /**
     * Send a ping to avoid being released for inactivity.
     * @calls {@link ControlledCommands.ping}
     */
    async ping(): Promise<null> {
        return this.client.commands.controlled.ping(this);
    }

    /**
     * Send a pose message.
     * @param options The options for the pose message.
     * @calls {@link ControlledCommands.pose}
     */
    async pose(options: Commands.Controlled.PoseOptions): Promise<null> {
        return this.client.commands.controlled.pose(this, options);
    }

    /**
     * Register a puppet character.
     * @param charId The ID of the character to register as a puppet.
     * @calls {@link ControlledCommands.registerPuppet}
     */
    async registerPuppet(charId: string): Promise<null> {
        return this.client.commands.controlled.registerPuppet(this, charId);
    }

    /**
     * Reject control of a puppet.
     * @param charId The ID of the character to reject control of.
     * @param msg An optional message to include with the rejection.
     * @calls {@link ControlledCommands.controlRequestReject}
     */
    async rejectControlRequest(charId: string, msg?: string): Promise<null> {
        return this.client.commands.controlled.controlRequestReject(this, charId, msg);
    }

    /**
     * Release control of this character.
     * @param msg A release message to show.
     * @calls {@link ControlledCommands.release}
     */
    async release(msg?: string): Promise<null> {
        return this.client.commands.controlled.release(this, msg);
    }

    /**
     * Remove a location.
     * @param locationId The ID of the location to remove.
     * @param type The type of the location.
     * @calls {@link ControlledCommands.removeLocation}
     */
    async removeLocation(locationId: string, type: LocationType): Promise<null> {
        return this.client.commands.controlled.removeLocation(this, locationId, type);
    }

    /**
     * Remove a tag from this character.
     * @param tagId The ID of the tag to remove.
     * @calls {@link setTags}
     */
    async removeTag(tagId: string): Promise<null> {
        return this.setTags({ [tagId]: null });
    }

    /**
     * Remove a teleport node.
     * @param nodeId The ID of the node to remove.
     * @calls {@link ControlledCommands.removeTeleport}
     */
    async removeTeleport(nodeId: string): Promise<null> {
        return this.client.commands.controlled.removeTeleport(this, nodeId);
    }

    /**
     * Request to create an exit.
     * @param name The name of the exit.
     * @param keys The keys to use for the exit.
     * @param targetRoom The ID of the room the exit leads to
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.requestCreateExit} > {@link ResClient.get} (x2)
     */
    async requestCreateExit(name: string, keys: Array<string>, targetRoom: string): Promise<{ exit: Exit; room: Room; }> {
        return this.client.commands.controlled.requestCreateExit(this, { name, keys, targetRoom })
            .then(async r => {
                const [exit, room] = await Promise.all([
                    this.api.get<Exit>(ResourceIDs.EXIT({ id: r.exit.id })),
                    this.api.get<Room>(ResourceIDs.ROOM({ id: r.targetRoom.id }))
                ]);

                return { exit, room };
            });
    }

    /**
     * Request to set the owner of an area.
     * @param areaId The ID of the area to change ownership of.
     * @param charId The ID of the character to set as the new owner.
     * @areaOwnershipRequired
     * @calls {@link ControlledCommands.requestSetAreaOwner} > {@link WolferyJS.getChar}
     */
    async requestSetAreaOwner(areaId: string, charId: string): Promise<Character> {
        return this.client.commands.controlled.requestSetAreaOwner(this, areaId, charId)
            .then(r => this.client.getChar(r.id));
    }

    /**
     * Request to set the parent of an area.
     * @param areaId The ID of the area to change the parent of.
     * @param parentId The ID of the area to set as the new parent.
     * @areaOwnershipRequired
     * @calls {@link ControlledCommands.requestSetAreaParent}
     */
    async requestSetAreaParent(areaId: string, parentId: string): Promise<null> {
        return this.client.commands.controlled.requestSetAreaParent(this, areaId, parentId);
    }

    /**
     * Request to set a room.
     * @param roomId The ID of the room to set.
     * @param options The options to set.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.requestSetRoom}
     */
    async requestSetRoom(roomId: string, options: Commands.Controlled.RequestSetRoomOptions): Promise<null> {
        return this.client.commands.controlled.requestSetRoom(this, roomId, options);
    }

    /**
     * Request to set the area of a room.
     * @param roomId The ID of the room to set.
     * @param areaId The ID of the area to set.
     * @roomOwnershipRequired
     * @calls {@link requestSetRoom}
     */
    async requestSetRoomArea(roomId: string, areaId: string): Promise<null> {
        return this.requestSetRoom(roomId, { areaId });
    }

    /**
     * Request to the the owner of a room.
     * @param roomId The ID of the room.
     * @param charId The ID of the new owner.
     * @returns The new owner.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.requestSetRoomOwner} > {@link WolferyJS.getChar}
     */
    async requestSetRoomOwner(roomId: string, charId: string): Promise<Character> {
        return this.client.commands.controlled.requestSetRoomOwner(this, roomId, charId)
            .then(r => this.client.getChar(r.id));
    }

    /**
     * Roll dice.
     * @param roll Accepts a number (sides), an array of `[amount, sides]` (e.g. `[2, 6]`), or a string consisting of a combination of dice sets `{amount}d{sides}` (e.g. `2d6`) and equations (e.g. `2d6+3`)
     * @param quiet If true, the roll will not be announced in the room.
     * @calls {@link ControlledCommands.roll}
     */
    async roll(roll: number | [amount: number, sides: number] | string, quiet = false): Promise<Messages.Roll> {
        return this.client.commands.controlled.roll(this, roll, quiet);
    }

    /**
     * Teleport to a room. You must own the room.
     * @param roomId The ID of the room to teleport to.
     * @roomOwnershipRequired
     * @calls {@link teleport}
     */
    async roomTeleport(roomId: string): Promise<null> {
        return this.teleport({ roomId });
    }

    /**
     * Send a message.
     * @param msg The message to send.
     * @calls {@link ControlledCommands.say}
     */
    async say(msg: string): Promise<null> {
        return this.client.commands.controlled.say(this, msg);
    }

    /**
     * Set options for this character.
     * @param options The options to set.
     * @calls {@link ControlledCommands.setCharacter}
     */
    async set(options: Commands.Controlled.SetCharacterOptions): Promise<null> {
        return this.client.commands.controlled.setCharacter(this, options);
    }

    /**
     * Set options for an area.
     * @param areaId The ID of the area to set.
     * @param options The options to set.
     * @returns The area.
     * @areaOwnershipRequired
     * @calls {@link removeLocation}, {@link ControlledCommands.setArea}
     */
    async setArea(areaId: string, options: Commands.Controlled.SetAreaOptions): Promise<null> {
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/main/commands/setArea/SetArea.js#L163-L164
        if (options.parentId === null) {
            delete options.parentId;
            await this.removeLocation(areaId, "area");
        }
        return this.client.commands.controlled.setArea(this, areaId, options);
    }

    /**
     * Set the owner of an area. Unless you own the target character, the `Builder` role is required.
     * @param areaId The ID of the area to.
     * @param charId The ID of the character to set as owner.
     * @returns The new owner character.
     * @areaOwnershipRequired
     * @calls {@link ControlledCommands.setAreaOwner} > {@link WolferyJS.getChar}
     */
    async setAreaOwner(areaId: string, charId: string): Promise<Character> {
        return this.client.commands.controlled.setAreaOwner(this, areaId, charId)
            .then(r => this.client.getChar(r.id));
    }

    /**
     * Set options for an exit. You must own the room, and be present in it.
     * @param exitId The ID of the exit.
     * @param options The options to set.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.setExit}
     */
    async setExit(exitId: string, options: Commands.Controlled.SetExitOptions): Promise<null> {
        return this.client.commands.controlled.setExit(this, exitId, options);
    }

    /**
     * Set the order of an exit.
     * @param exitId The ID of the exit.
     * @param order The new order of the exit.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.setExitOrder}
     */
    async setExitOrder(exitId: string, order: number): Promise<null> {
        return this.client.commands.controlled.setExitOrder(this, exitId, order);
    }

    /**
     * Set your home to your current room.
     * @calls {@link ControlledCommands.setHome}
     */
    async setHome(): Promise<null> {
        return this.client.commands.controlled.setHome(this);
    }

    /**
     * Set location options.
     * @param locationId The ID of the location.
     * @param type The type of the location.
     * @param options The options to set.
     * @calls {@link ControlledCommands.setLocation}
     */
    async setLocation(locationId: string, type: LocationType, options: Commands.Controlled.SetLocation): Promise<null> {
        return this.client.commands.controlled.setLocation(this, locationId, type, options);
    }

    /**
     * Set options for a profile.
     * @param profileId The ID of the profile to set.
     * @param options The options to set.
     * @calls {@link ControlledCommands.setProfile} > {@link Profiles.fetch}
     */
    async setProfile(profileId: string, options: Commands.Controlled.SetProfileOptions): Promise<Profile> {
        return this.client.commands.controlled.setProfile(this, profileId, options)
            .then(r => this.profiles.fetch(r.id));
    }

    /**
     * Set options for a puppet.
     * @param puppetId The ID of the puppet.
     * @param options The options to set.
     * @calls {@link ControlledCommands.setPuppet}
     */
    async setPuppet(puppetId: string, options: Commands.Controlled.SetPuppetOptions): Promise<null> {
        return this.client.commands.controlled.setPuppet(this, puppetId, options);
    }

    /**
     * Set options for a room.
     * @param roomId The ID of the room to set.
     * @param options The options to set.
     * @roomOwnershipRequired
     * @calls {@link removeLocation}, {@link ControlledCommands.setRoom}
     */
    async setRoom(roomId: string, options: Commands.Controlled.SetRoomOptions): Promise<null> {
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/main/commands/setRoom/SetRoom.js#L183-L184
        if (options.areaId === null) {
            delete options.areaId;
            await this.removeLocation(roomId, "room");
        }
        return this.client.commands.controlled.setRoom(this, roomId, options);
    }

    /**
     * Set the owner of a room. Unless you own the target character, the `Builder` role is required.
     * @param roomId The ID of the room to set.
     * @param charId The ID of the character to set as owner.
     * @returns The new owner character.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.setRoomOwner} > {@link WolferyJS.getChar}
     */
    async setRoomOwner(roomId: string, charId: string): Promise<Character> {
        return this.client.commands.controlled.setRoomOwner(this, roomId, charId)
            .then(r => this.client.getChar(r.id));
    }

    /**
     * Set options for a room profile.
     * @param profileId The ID of the room profile.
     * @param options The options to set.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.setRoomProfile}
     */
    async setRoomProfile(profileId: string, options: Commands.Controlled.SetRoomProfileOptions): Promise<NameBasicResponse>  {
        return this.client.commands.controlled.setRoomProfile(this, profileId, options);
    }

    /**
     * Set a room profile image.
     * @param profileId The ID of the room profile.
     * @param image The image to set. Either a fully qualified base64 url, or a buffer.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.setRoomProfileImage}
     */
    async setRoomProfileImage(profileId: string, image: string | Buffer): Promise<null> {
        return this.client.commands.controlled.setRoomProfileImage(this, profileId, image);
    }

    /**
     * Set options for a room script.
     * @param scriptId The ID of the script to set.
     * @param options The options to set.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.setRoomScript} > {@link ResClient.get} (x2)
     */
    async setRoomScript(scriptId: string, options: Commands.Controlled.SetRoomScriptOptions): Promise<{ room: Room; script: RoomScriptDetails; }> {
        return this.client.commands.controlled.setRoomScript(this, scriptId, options)
            .then(async r => {
                const [room, script] = await Promise.all([
                    this.api.get<Room>(ResourceIDs.ROOM({ id: r.room.id })),
                    this.api.get<RoomScriptDetails>(ResourceIDs.ROOM_SCRIPT_DETAILS({ id: r.script.id }))
                ]);
                return { room, script };
            });
    }

    /**
     * Set the status message this character.
     * @param status The status message.
     * @calls {@link set}
     */
    async setStatus(status: string): Promise<null> {
        return this.set({ status });
    }

    /**
     * Set tags for this character.
     * @param tags A key-value object of id to preference or null.
     * @calls {@link ControlledCommands.setTags}
     */
    async setTags(tags: Record<string, TagPref | null>): Promise<null> {
        return this.client.commands.controlled.setTags(this, tags);
    }

    /**
     * Set a teleport node.
     * @param nodeId The ID of the node.
     * @param options The options for the teleport node.
     * @calls {@link ControlledCommands.setTeleport}
     */
    async setTeleport(nodeId: string, options: Commands.Controlled.SetTeleportOptions): Promise<null> {
        return this.client.commands.controlled.setTeleport(this, nodeId, options);
    }

    /**
     * Put this character to sleep.
     * @param msg A sleep message to show.
     * @calls {@link release}
     */
    async sleep(msg?: string): Promise<null> {
        return this.release(msg);
    }

    /**
     * Stop following a character.
     * @calls {@link ControlledCommands.stopFollow}
     */
    async stopFollow(): Promise<null> {
        return this.client.commands.controlled.stopFollow(this);
    }

    /**
     * Stop leading a character.
     * @param charId The ID of the character to stop leading. If not provided, stops leading all characters.
     * @calls {@link ControlledCommands.stopLead}
     */
    async stopLead(charId?: string): Promise<null> {
        return this.client.commands.controlled.stopLead(this, charId);
    }

    /**
     * Stop LFRP status.
     * @calls {@link set}
     */
    async stopLfrp(): Promise<null> {
        return this.set({ rp: "" });
    }

    /**
     * Request to summon a character.
     * @param charId The ID of the character to summon.
     * @calls {@link ControlledCommands.summon}
     */
    async summon(charId: string): Promise<null> {
        return this.client.commands.controlled.summon(this, charId);
    }

    /**
     * Sweep characters out of the room. If no character id is provided, sleeping characters are swept.
     * @param charId The ID of a specific character to sweep. You must own the room.
     * @calls {@link ControlledCommands.sweep}
     */
    async sweep(charId?: string): Promise<null> {
        return this.client.commands.controlled.sweep(this, charId);
    }

    /**
     * Sync a profile with this character's current details.
     * @param profileId The ID of the profile to sync.
     * @calls {@link updateProfile}
     */
    async syncProfile(profileId: string): Promise<null> {
        return this.updateProfile(profileId);
    }

    /**
     * Sync a room with its current details.
     * @param profileId The ID of the room to sync.
     * @roomOwnershipRequired
     * @calls {@link updateRoomProfile}
     */
    async syncRoomProfile(profileId: string): Promise<null> {
        return this.updateRoomProfile(profileId);
    }

    /**
     * Teleport.
     * @param options The options for teleporting.
     * @calls {@link ControlledCommands.teleport}
     */
    async teleport(options: Commands.Controlled.TeleportOptions): Promise<null> {
        return this.client.commands.controlled.teleport(this, options);
    }

    /**
     * Teleport to your home.
     * @calls {@link ControlledCommands.teleportHome}
     */
    async teleportHome(): Promise<null> {
        return this.client.commands.controlled.teleportHome(this);
    }

    /**
     * Stop looking at a character.
     * @calls {@link look}
     */
    async unlook(): Promise<null> {
        return this.look(this.id);
    }

    /**
     * Sync a profile with your current details.
     * @param profileId The ID of the profile to sync.
     * @calls {@link ControlledCommands.updateProfile}
     */
    async updateProfile(profileId: string): Promise<null> {
        return this.client.commands.controlled.updateProfile(this, profileId);
    }

    /**
     * Sync a room with its current details.
     * @param profileId The ID of the room to sync.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.updateRoomProfile}
     */
    async updateRoomProfile(profileId: string): Promise<null> {
        return this.client.commands.controlled.updateRoomProfile(this, profileId);
    }

    /**
     * Use an exit.
     * @param options The options for the exit to use.
     * @calls {@link ControlledCommands.useExit}
     */
    async useExit(options: Commands.Controlled.UseExitOptions): Promise<null> {
        return this.client.commands.controlled.useExit(this, options);
    }

    /**
     * Apply a profile.
     * @param profileId The ID of the profile to use.
     * @param safe If a check should be made to ensure the current character info is stored in a profile.
     * @calls {@link ControlledCommands.useProfile} > {@link Profiles.fetch}
     */
    async useProfile(profileId: string, safe = true): Promise<Profile> {
        return this.client.commands.controlled.useProfile(this, profileId, safe)
            .then(r => this.profiles.fetch(r.id));
    }

    /**
     * Apply a room profile. You must own the room and be in it.
     * @param profileId The ID of the room profile to use.
     * @param safe If a check should be made to ensure the current room info is stored in a profile.
     * @roomOwnershipRequired
     * @calls {@link ControlledCommands.useRoomProfile} > {@link ResClient.get}
     */
    async useRoomProfile(profileId: string, safe = true): Promise<RoomProfile> {
        return this.client.commands.controlled.useRoomProfile(this, profileId, safe)
            .then(r => this.api.get<RoomProfile>(ResourceIDs.ROOM_PROFILE({ id: r.id })));
    }

    /**
     * Wake up this character.
     * @param hidden If the character should be hidden from the awake list. Only applicable to bots.
     * @param force Ignore the character already being awake.
     * @calls {@link ControlledCommands.wakeup}
     */
    async wakeup(hidden?: boolean, force = false): Promise<null> {
        if (force && this.state === "awake") return null;
        return this.client.commands.controlled.wakeup(this, hidden);
    }

    /**
     * Send a whisper to a character. You must be in the same room as them.
     * @param charId The ID of the character to whisper to.-
     * @param options The options for the whisper.
     * @calls {@link ControlledCommands.whisper}
     */
    async whisper(charId: string, options: Commands.Controlled.WhisperOptions): Promise<null> {
        return this.client.commands.controlled.whisper(this, charId, options);
    }
}

export default ControlledCharacter;
