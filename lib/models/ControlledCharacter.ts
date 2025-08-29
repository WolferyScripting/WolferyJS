import type Room from "./Room.js";
import type Area from "./Area.js";
import type Profile from "./Profile.js";
import BaseModel from "./BaseModel.js";
import type Character from "./Character.js";
import type Exit from "./Exit.js";
import type RoomProfile from "./RoomProfile.js";
import type RoomScript from "./RoomScript.js";
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
import ResourceIDs from "../generated/ResourceIDs.js";
import {
    type KeyBasicResponse,
    type BasicCharacterResponse,
    type NameBasicResponse,
    type DeleteNameResponse,
    type Messages,
    type PublicPopulationUpdate,
    type AreaDetailsPopulationUpdate
} from "../util/types.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import ResEventObserver from "../util/ResEventObserver.js";
import type { ControlledCharacterProperties } from "../generated/models/types.js";
import { ControlledCharacterDefinition } from "../generated/models/definitions.js";
import { PING_DURATION } from "../util/Constants.js";
import type RoomProfiles from "../collections/RoomProfiles.js";
import type RoomScripts from "../collections/RoomScripts.js";
import { kControlledCharacter } from "../util/Util.js";
import { fileTypeFromBuffer } from "file-type";
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
     */
    async acceptControl(charId: string): Promise<null> {
        return this.call<null>("controlRequestAccept", { charId });
    }

    /**
     * Add a tag to this character.
     * @param tagId The ID of the tag to add.
     * @param pref The preference for the tag.
     */
    async addTag(tagId: string, pref: "like" | "dislike"): Promise<null> {
        return this.tags.add(tagId, pref);
    }

    /**
     * Add a new teleport node.
     * @param options The options for the teleport node.
     */
    async addTeleport(options: Commands.ControlledCharacter.AddTeleportOptions): Promise<null> {
        return this.call<null>("addTeleport", options);
    }

    /**
     * Address a character. This is the equivalent of the `@` command in the web client.
     * @param charId The ID of the character to address.
     * @param options The options for addressing the character.
     */
    async address(charId: string, options: Commands.ControlledCharacter.AddressOptions): Promise<null> {
        return this.call<null>("address", { charId, ...options });
    }

    /** Set this character as away (afk). */
    async away(status?: string): Promise<null> {
        return this.call<null>("away", { status });
    }

    /**
     * Copy this character's avatar to the profile.
     * @param profileId The ID of the profile to copy the avatar to.
     * @returns The profile.
     */
    async copyProfileAvatar(profileId: string): Promise<Profile> {
        return this.call<Record<"profile", NameBasicResponse>>("copyProfileAvatar", { profileId })
            .then(r => this.api.get<Profile>(ResourceIDs.PROFILE({ id: r.profile.id })));
    }

    /**
     * Copy this character's image to the profile.
     * @param profileId The ID of the profile to copy the image to.
     * @returns The profile.
     */
    async copyProfileImage(profileId: string): Promise<Profile> {
        return this.call<Record<"profile", NameBasicResponse>>("copyProfileImage", { profileId })
            .then(r => this.api.get<Profile>(ResourceIDs.PROFILE({ id: r.profile.id })));
    }

    /**
     * Create a new area.
     * @param name The name of the area.
     */
    async createArea(name: string): Promise<Area> {
        return this.call<NameBasicResponse>("createArea", { name })
            .then(r => this.client.waitForCached<Area>(ResourceIDs.AREA({ id: r.id })));
    }

    /**
     * Create an exit to another room.
     * @param name The name of the exit.
     * @param keys The keys to use to go through the exit.
     * @param targetRoom The ID of the room to go to. Provide `null` to create a new room.
     */
    async createExit(name: string, keys: Array<string>, targetRoom: string | null): Promise<{ exit: Exit; targetRoom: Room; }> {
        return this.call<Record<"exit" | "targetRoom", NameBasicResponse>>("createExit", { name, keys, targetRoom }).then(async r => {
            const [exit, room] = await Promise.all([this.client.waitForCached<Exit>(ResourceIDs.EXIT({ id: r.exit.id })), this.client.waitForCached<Room>(ResourceIDs.ROOM({ id: r.targetRoom.id }))]);
            return { exit, targetRoom: room };
        });
    }

    /**
     * Create a profile based on this character's current attributes.
     * @param name The name of the profile.
     * @param key The key of the profile.
     */
    async createProfile(name: string, key: string): Promise<Profile> {
        return this.call<Record<"profile", NameBasicResponse>>("createProfile", { name, key }).then(r => this.client.waitForCached<Profile>(ResourceIDs.PROFILE({ id: r.profile.id })));
    }

    /**
     * Create a room.
     * @param name The name of the room.
     */
    async createRoom(name: string): Promise<Room> {
        return this.call<NameBasicResponse>("createRoom", { name }).then(r => this.client.waitForCached<Room>(ResourceIDs.ROOM({ id: r.id })));
    }

    /**
     * Create a room profile. You must own the room, and be present in it.
     * @param name The name of the room profile.
     * @param key The key of the room profile.
     */
    async createRoomProfile(name: string, key: string): Promise<RoomProfile> {
        return this.call<Record<"profile", NameBasicResponse>>("createRoomProfile", { name, key }).then(r => this.client.waitForCached<RoomProfile>(ResourceIDs.ROOM_PROFILE({ id: r.profile.id })));
    }

    /**
     * Create a room script. It will be created in the room the character is located in.
     * @param key The key of the room script.
     * @param options The options for the room script.
     */
    async createRoomScript(key: string, options?: Commands.ControlledCharacter.CreateRoomScriptOptions): Promise<{ room: Room; script: RoomScript; }> {
        return this.call<{ room: NameBasicResponse; script: KeyBasicResponse; }>("createRoomScript", { key, ...options }).then(async r => {
            const [room, script] = await Promise.all([
                this.api.get<Room>(ResourceIDs.ROOM({ id: r.room.id })),
                this.api.get<RoomScript>(ResourceIDs.ROOMSCRIPT({ id: r.script.id }))
            ]);
            return { room, script };
        });
    }

    /**
     * Delete an area.
     * @param areaId The ID of the area to delete.
     */
    async deleteArea(areaId: string): Promise<{ area: Area; response: DeleteNameResponse; }> {
        const area = await this.api.get<Area>(ResourceIDs.AREA({ id: areaId }));
        return this.call<DeleteNameResponse>("deleteArea", { areaId })
            .then(r => ({ area, response: r }));
    }

    /**
     * Delete an exit.
     * @param exitId The ID of the exit to delete.
     */
    async deleteExit(exitId: string): Promise<Exit> {
        const exit = this.api.get<Exit>(ResourceIDs.EXIT({ id: exitId }));
        return this.call<null>("deleteExit", { exitId }).then(() => exit);
    }

    /**
     * Delete a mail message. You must be using the username/password authentication method to use this.
     * @param messageId The ID of the message to delete.
     */
    async deleteMail(messageId: string): Promise<null> {
        return this.client.modules.core.getPlayer().then(player =>
            this.api.call<null>(ResourceIDs.PLAYER_MAIL_MESSAGE({ player: player.id, message: messageId }), "delete")
        );
    }

    /**
     * Delete a profile.
     * @param profileId The ID of the profile to delete.
     */
    async deleteProfile(profileId: string): Promise<Profile> {
        const profile = await this.api.get<Profile>(ResourceIDs.PROFILE({ id: profileId }));
        return this.call<Record<"profile", NameBasicResponse>>("deleteProfile", { profileId })
            .then(() => profile);
    }

    /**
     * Delete a room.
     * @param roomId The ID of the room to delete.
     */
    async deleteRoom(roomId: string): Promise<Room> {
        const room = await this.api.get<Room>(ResourceIDs.ROOM({ id: roomId }));
        return this.call<null>("deleteRoom", { roomId })
            .then(() => room);
    }

    /**
     * Delete a room profile. You must own the room, and be present in it.
     * @param profileId The ID of the room profile to delete.
     */
    async deleteRoomProfile(profileId: string): Promise<Record<"profile", NameBasicResponse>> {
        return this.call<Record<"profile", NameBasicResponse>>("deleteRoomProfile", { profileId });
    }

    /**
     * Delete a room script. You must own the room, and be present in it.
     * @param scriptId The ID of the room script to delete.
     */
    async deleteRoomScript(scriptId: string): Promise<{ room: Room; script: RoomScript | KeyBasicResponse; }> {
        return this.call<{ room: NameBasicResponse; script: KeyBasicResponse; }>("deleteRoomScript", { scriptId }).then(async r => {
            const room = await this.api.get<Room>(ResourceIDs.ROOM({ id: r.room.id }));
            const script = this.api.getCached<RoomScript>(ResourceIDs.ROOMSCRIPT({ id: r.script.id })) ?? r.script;
            return { room, script };
        });
    }

    /**
     * Describe a scene or action.
     * @param msg The message.
     */
    async describe(msg: string): Promise<null> {
        return this.call<null>("describe", { msg });
    }

    /**
     * Evict a character from their teleport nodes or home for the current room.
     * @param charId The ID of the character to evict.
     * @returns The evicted character.
     */
    async evict(charId: string): Promise<Character> {
        return this.call<BasicCharacterResponse<"targetChar">>("evict", { charId })
            .then(r => this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.targetChar.id })));
    }

    /**
     * Evict a character from their home in the current room.
     * @param charId The ID of the character to evict.
     * @returns The evicted character.
     */
    async evictHome(charId: string): Promise<Character> {
        return this.call<BasicCharacterResponse<"char">>("evictHome", { charId })
            .then(r => this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.char.id })));
    }

    /**
     * Evict a character from controlling a puppet.
     * @param charId The ID of the character to evict.
     * @param puppetId The ID of the puppet to evict.
     * @returns The evicted character and puppet.
     */
    async evictPuppeteer(charId: string, puppetId: string): Promise<{ char: Character; puppet: Character; }> {
        return this.call<BasicCharacterResponse<"char"> & BasicCharacterResponse<"puppet">>("evictPuppeteer", { charId, puppetId })
            .then(async r => {
                const [char, puppet] = await Promise.all([
                    this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.char.id })),
                    this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.puppet.id }))
                ]);
                return { char, puppet };
            });
    }

    /**
     * Evict a character from their teleport node.
     * @param charId The ID of the character to evict.
     * @returns The evicted character.
     */
    async evictTeleport(charId: string): Promise<Character> {
        return this.call<BasicCharacterResponse<"char">>("evictTeleport", { charId })
            .then(r => this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.char.id })));
    }

    /**
     * Focus a character.
     * Focus a character.
     * @param targetId The ID of the character to focus.
     * @param options The options for focusing the character.
     * @returns The focused character.
     */
    async focusChar(targetId: string, options: Omit<Commands.Player.FocusCharOptions, "targetId">): Promise<Character> {
        return this.client.modules.core.getPlayer().then(player =>
            player.focusChar(this.id, { targetId, ...options })
        );
    }

    /**
     * Request to follow a character.
     * @param charId The ID of the character to follow.
     */
    async follow(charId: string): Promise<null> {
        return this.call<null>("follow", { charId });
    }

    /**
     * Get the character for this controlled character.
     * @returns The character.
     */
    async getChar(): Promise<Character> {
        return this.api.get<Character>(ResourceIDs.CHARACTER({ id: this.id }));
    }

    /**
     * Get an exit in the current room.
     * @param options The options for getting the exit.
     * @returns The exit.
     */
    async getExit(options: Commands.ControlledCharacter.GetExitOptions): Promise<Exit> {
        return this.call<Exit>("getExit", options);
    }

    async getLogEvents(startTime?: number): Promise<Commands.LogEvents> {
        return this.api.call<Commands.LogEvents>("log.events", "get", { charId: this.id, startTime });
    }

    /**
     * Get the owned character for this controlled character. If the character is a puppet, use {@link getPuppet} instead.
     * @returns The owned character.
     */
    async getOwnedChar(): Promise<OwnedCharacter> {
        return this.api.get<OwnedCharacter>(ResourceIDs.OWNED_CHARACTER({ id: this.id }));
    }

    /**
     * Get the puppet for this controlled character. If the character is not a puppet, use {@link getOwnedChar} instead.
     * @returns The controlled puppet.
     */
    async getPuppet(): Promise<Puppet> {
        const { char, puppet } = ResourceIDs.CONTROLLED_PUPPET.parts(this.rid);
        return this.api.get<Puppet>(ResourceIDs.PUPPET({ char, puppet }));
    }

    /**
     * Get the room character for this controlled character.
     * @returns The room character.
     */
    async getRoomChar(): Promise<RoomCharacter> {
        return this.api.get<RoomCharacter>(ResourceIDs.ROOM_CHARACTER({ id: this.id }));
    }

    /**
     * Send a message to the helpers.
     * @param msg The message.
     */
    async helpme(msg: string): Promise<null> {
        return this.call<null>("helpme", { msg });
    }

    /**
     * Request to join a character.
     * @param charId The ID of the character to join.
     */
    async join(charId: string): Promise<null> {
        return this.call<null>("join", { charId });
    }

    /**
     * Request to lead a character.
     * @param charId The ID of the character to lead.
     */
    async lead(charId: string): Promise<null> {
        return this.call<null>("lead", { charId });
    }

    /**
     * Set the LFRP status for the character.
     * @param msg The message to display when LFRP is enabled.
     */
    async lfrp(msg?: string): Promise<null> {
        if (msg) {
            await this.client.modules.core.getPlayer().then(player => player.setCharSettings(this.id, { lfrpDesc: msg }));
        }

        return this.call<null>("set", { rp: "lfrp" });
    }


    /**
     * Look at a character.
     * @param charId The ID of the character to look at.
     */
    async look(charId: string): Promise<null> {
        return this.call<null>("look", { charId });
    }

    /**
     * Send a mail to a character. You must be using the username/password authentication method to use this.
     * @param toCharId The ID of the character to send the mail to.
     * @param options The options for the mail.
     */
    async mail(toCharId: string, options: Commands.Inbox.SendOptions): Promise<Character> {
        return this.client.modules.core.getPlayer().then(player => player.getInbox()).then(inbox => inbox.send(this.id, toCharId, options));
    }

    /**
     * Send a message to a character.
     * @param charId The ID of the character to send the message to.
     * @param options The options for sending the message.
     */
    async message(charId: string, options: Commands.ControlledCharacter.MessageOptions): Promise<null> {
        return this.call<null>("message", { charId, ...options });
    }

    /**
     * Teleport to a node.
     * @param nodeId The ID of the node to teleport to.
     */
    async nodeTeleport(nodeId: string): Promise<null> {
        return this.teleport({ nodeId });
    }

    /**
     * Send an OOC message.
     * @param options The options for the OOC message.
     */
    async ooc(options: Commands.ControlledCharacter.OOCOptions): Promise<null> {
        return this.call<null>("ooc", options);
    }

    /** Send a ping to avoid being released for inactivity. */
    async ping(): Promise<null> {
        return this.call<null>("ping");
    }

    /**
     * Send a pose message.
     * @param msg The message to send.
     */
    async pose(msg: string): Promise<null> {
        return this.call<null>("pose", { msg });
    }

    /**
     * Mark a mail message as read. You must be using the username/password authentication method to use this.
     */
    async readMail(message: string): Promise<null> {
        return this.client.modules.core.getPlayer().then(player =>
            this.api.call<null>(ResourceIDs.PLAYER_MAIL_MESSAGE({ player: player.id, message }), "read")
        );
    }

    /**
     * Register a puppet character.
     * @param charId The ID of the character to register as a puppet.
     */
    async registerPuppet(charId: string): Promise<null> {
        return this.call<null>("registerPuppet", { charId });
    }

    /**
     * Reject control of a puppet.
     * @param charId The ID of the character to reject control of.
     * @param msg An optional message to include with the rejection.
     */
    async rejectControl(charId: string, msg?: string): Promise<null> {
        return this.call<null>("controlRequestReject", { charId, msg });
    }

    /**
     * Release control of this character.
     * @param msg A release message to show.
     */
    async release(msg?: string): Promise<null> {
        return this.call<null>("release", { msg });
    }

    /**
     * Remove a location.
     * @param locationId The ID of the location to remove.
     * @param type The type of the location.
     */
    async removeLocation(locationId: string, type: "area" | "room"): Promise<null> {
        return this.call<null>("removeLocation", { locationId, type });
    }

    /**
     * Remove a tag from this character.
     * @param tagId The ID of the tag to remove.
     */
    async removeTag(tagId: string): Promise<null> {
        return this.tags.remove(tagId);
    }

    /**
     * Remove a teleport node.
     * @param nodeId The ID of the node to remove.
     */
    async removeTeleport(nodeId: string): Promise<null> {
        return this.call<null>("removeTeleport", { nodeId });
    }

    /**
     * Request to create an exit.
     * @param name The name of the exit.
     * @param keys The keys to use for the exit.
     * @param targetRoom The ID of the room the exit leads to
     */
    async requestCreateExit(name: string, keys: Array<string>, targetRoom: string): Promise<Record<"exit" | "targetRoom", NameBasicResponse>> {
        return this.call<Record<"exit" | "targetRoom", NameBasicResponse>>("requestCreateExit", { name, keys, targetRoom });
    }

    /**
     * Request to set the owner of an area.
     * @param areaId The ID of the area to change ownership of.
     * @param charId The ID of the character to set as the new owner.
     * @returns The new owner character.
     */
    async requestSetAreaOwner(areaId: string, charId: string): Promise<Character> {
        return this.call<BasicCharacterResponse<"newOwner">>("requestSetAreaOwner", { areaId, charId })
            .then(r => this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.newOwner.id })));
    }

    /**
     * Request to set the parent of an area.
     * @param areaId The ID of the area to change the parent of.
     * @param parentId The ID of the area to set as the new parent.
     */
    async requestSetAreaParent(areaId: string, parentId: string): Promise<null> {
        return this.call<null>("requestSetAreaParent", { areaId, parentId });
    }

    /**
     * Request to set a room.
     * @param roomId The ID of the room to set.
     * @param options The options to set.
     * @returns The updated room.
     */
    async requestSetRoom(roomId: string, options: Commands.ControlledCharacter.RequestSetRoomOptions): Promise<null> {
        return this.call<null>("requestSetRoom", { roomId, ...options });
    }

    /**
     * Request to set the area of a room.
     * @param roomId The ID of the room to set.
     * @param areaId The ID of the area to set.
     */
    async requestSetRoomArea(roomId: string, areaId: string): Promise<null> {
        return this.requestSetRoom(roomId, { areaId });
    }

    async requestSetRoomOwner(roomId: string, charId: string): Promise<Character> {
        return this.call<BasicCharacterResponse<"newOwner">>("requestSetRoomOwner", { roomId, charId })
            .then(r => this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.newOwner.id })));
    }

    /**
     * Roll dice.
     * @param roll Accepts a number (sides), an array of `[amount, sides]` (e.g. `[2, 6]`), or a string consisting of a combination of dice sets `{amount}d{sides}` (e.g. `2d6`) and equations (e.g. `2d6+3`)
     * @param quiet If true, the roll will not be announced in the room.
     */
    async roll(roll: number | [amount: number, sides: number] | string, quiet = false): Promise<Messages.Roll> {
        const observer = new ResEventObserver<Messages.Roll>(this.client, this.rid, "out", { once: true, filter: (data): boolean => data.type === "roll" && data.char.id === this.id });
        if (typeof roll === "number") {
            roll = `1d${roll}`;
        } else if (Array.isArray(roll)) {
            roll = `${roll[0]}d${roll[1]}`;
        }
        const now = Date.now();
        return this.api.call<null>(ResourceIDs.ROLLER({ id: this.id }), "roll", { roll, quiet })
            .then(() => observer.get(500).catch(async() => {
                observer.end();
                const logs = await this.getLogEvents(now);
                return logs.events.find(l => l.type === "roll" && l.char.id === this.id) as Messages.Roll;
            }));
    }

    /**
     * Teleport to a room. You must own the room.
     * @param roomId The ID of the room to teleport to.
     */
    async roomTeleport(roomId: string): Promise<null> {
        return this.teleport({ roomId });
    }

    /**
     * Send a message.
     * @param msg The message to send.
     */
    async say(msg: string): Promise<null> {
        return this.call<null>("say", { msg });
    }

    /**
     * Set options for this character.
     * @param options The options to set.
     */
    async set(options: Commands.ControlledCharacter.SetOptions): Promise<null> {
        return this.call<null>("set", options);
    }

    /**
     * Set options for an area.
     * @param areaId The ID of the area to set.
     * @param options The options to set.
     * @returns The area.
     */
    async setArea(areaId: string, options: Commands.ControlledCharacter.SetAreaOptions): Promise<null> {
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/main/commands/setArea/SetArea.js#L163-L164
        if (options.parentId === null) {
            delete options.parentId;
            await this.removeLocation(areaId, "area");
        }
        return this.call<null>("setArea", { areaId, ...options });
    }

    /**
     * Set the owner of an area.
     * @param areaId The ID of the area to.
     * @param charId The ID of the character to set as owner.
     * @returns The new owner character.
     */
    async setAreaOwner(areaId: string, charId: string): Promise<Character> {
        return this.call<BasicCharacterResponse<"newOwner">>("setAreaOwner", { areaId, charId })
            .then(r => this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.newOwner.id })));
    }

    /**
     * Set options for an exit. You must own the room, and be present in it.
     * @param exitId The ID of the exit.
     * @param options The options to set.
     */
    async setExit(exitId: string, options: Commands.ControlledCharacter.SetExitOptions): Promise<null> {
        return this.call<null>("setExit", { exitId, ...options });
    }

    /**
     * Set the order of an exit.
     * @param exitId The ID of the exit.
     * @param order The new order of the exit.
     */
    async setExitOrder(exitId: string, order: number): Promise<null> {
        return this.call<null>("setExitOrder", { exitId, order });
    }

    /**
     * Set your home to your current room.
     */
    async setHome(): Promise<null> {
        return this.call<null>("setHome");
    }

    /**
     * Set location options.
     * @param locationId The ID of the location.
     * @param type The type of the location.
     * @param options The options to set.
     */
    async setLocation(locationId: string, type: "area" | "room", options: Commands.ControlledCharacter.SetLocation): Promise<null> {
        return this.call<null>("setLocation", { locationId, type, ...options });
    }

    /**
     * Set options for a profile.
     * @param profileId The ID of the profile to set.
     * @param options The options to set.
     * @returns The profile.
     */
    async setProfile(profileId: string, options: Commands.ControlledCharacter.SetProfileOptions): Promise<Profile> {
        return this.call<Record<"profile", NameBasicResponse>>("setProfile", { profileId, ...options })
            .then(r => this.api.get<Profile>(ResourceIDs.PROFILE({ id: r.profile.id })));
    }

    /**
     * Copy this character's image to the puppet.
     * @param puppetId The ID of the puppet to copy the image to.
     * @param options The options to set.
     * @returns The puppet.
     */
    async setPuppet(puppetId: string, options: Commands.ControlledCharacter.SetPuppetOptions): Promise<null> {
        // response unconfirmed
        return this.call<null>("setPuppet", { puppetId, ...options });
    }

    /**
     * Set options for a room.
     * @param roomId The ID of the room to set.
     * @param options The options to set.
     */
    async setRoom(roomId: string, options: Commands.ControlledCharacter.SetRoomOptions): Promise<null> {
        // https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/main/commands/setRoom/SetRoom.js#L183-L184
        if (options.areaId === null) {
            delete options.areaId;
            await this.removeLocation(roomId, "room");
        }
        return this.call<null>("setRoom", { roomId, ...options });
    }

    /**
     * Set the owner of a room.
     * @param roomId The ID of the room to set.
     * @param charId The ID of the character to set as owner.
     * @returns The new owner character.
     */
    async setRoomOwner(roomId: string, charId: string): Promise<Character> {
        return this.call<BasicCharacterResponse<"newOwner">>("setRoomOwner", { roomId, charId })
            .then(r => this.api.get<Character>(ResourceIDs.CHARACTER({ id: r.newOwner.id })));
    }

    /**
     * Set options for a room profile.
     * @param profileId The ID of the room profile.
     * @param options The options to set.
     */
    async setRoomProfile(profileId: string, options: Commands.ControlledCharacter.SetRoomProfileOptions): Promise<Record<"profile", NameBasicResponse>>  {
        return this.call<Record<"profile", NameBasicResponse>>("setRoomProfile", { profileId, ...options });
    }

    /**
     * Set a room profile image.
     * @param profileId The ID of the room profile.
     * @param image The image to set. Either a fully qualified base64 url, or a buffer.
     */
    async setRoomProfileImage(profileId: string, image: string | Buffer): Promise<null> {
        if (Buffer.isBuffer(image)) {
            image = `data:${(await fileTypeFromBuffer(image))?.mime ?? "application/octet-stream"};base64,${image.toString("base64")}`;
        }
        return this.call<null>("setRoomProfileImage", { profileId, dataUrl: image });
    }

    /**
     * Set options for a room script.
     * @param scriptId The ID of the script to set.
     * @param options The options to set.
     */
    async setRoomScript(scriptId: string, options?: Commands.ControlledCharacter.SetRoomScriptOptions): Promise<{ room: Room; script: RoomScript; }> {
        return this.call<{ room: NameBasicResponse; script: KeyBasicResponse; }>("setRoomScript", { scriptId, ...options }).then(async r => {
            const [room, script] = await Promise.all([
                this.api.get<Room>(ResourceIDs.ROOM({ id: r.room.id })),
                this.api.get<RoomScript>(ResourceIDs.ROOMSCRIPT({ id: r.script.id }))
            ]);
            return { room, script };
        });
    }

    /**
     * Set the status message this character.
     * @param status The status message.
     */
    async setStatus(status: string): Promise<null> {
        return this.call<null>("set", { status });
    }

    /**
     * Set a teleport node key.
     * @param nodeId The ID of the node.
     * @param options The options for the teleport node.
     */
    async setTeleport(nodeId: string, options: Commands.ControlledCharacter.SetTeleportOptions): Promise<null> {
        return this.call<null>("setTeleport", { nodeId, ...options });
    }

    /**
     * Put this character to sleep.
     * @param msg A sleep message to show.
     * @note Alias of {@link release}
     */
    async sleep(msg?: string): Promise<null> {
        return this.release(msg);
    }

    /**
     * Stop following a character.
     */
    async stopFollow(): Promise<null> {
        return this.call<null>("stopFollow");
    }

    /**
     * Stop leading a character.
     * @param charID The ID of the character to stop leading. If not provided, stops leading all characters.
     */
    async stopLead(charID?: string): Promise<null> {
        return this.call<null>("stopLead", { charID });
    }

    /** Stop LFRP status. */
    async stopLfrp(): Promise<null> {
        return this.call<null>("set", { rp: "" });
    }

    /**
     * Request to summon a character.
     * @param charId The ID of the character to summon.
     */
    async summon(charId: string): Promise<null> {
        return this.call<null>("summon", { charId });
    }

    /**
     * Sweep characters out of the room. If no character id is provided, sleeping characters are swept.
     * @param charId The ID of a specific character to sweep. You must own the room.
     */
    async sweep(charId?: string): Promise<null> {
        return this.call<null>("sweep", { charId });
    }

    /**
     * Sync a profile with this character's current details.
     * @note Alias of {@link updateProfile}
     * @param profileId The ID of the profile to sync.
     */
    async syncProfile(profileId: string): Promise<null> {
        return this.updateProfile(profileId);
    }

    /**
     * Sync a room with its current details.
     * @note Alias of {@link updateRoomProfile}
     * @param profileId The ID of the room to sync.
     */
    async syncRoomProfile(profileId: string): Promise<null> {
        return this.updateRoomProfile(profileId);
    }

    /**
     * Teleport.
     * @param options The options for teleporting.
     */
    async teleport(options: Commands.ControlledCharacter.TeleportOptions): Promise<null> {
        return this.call<null>("teleport", options);
    }

    /**
     * Teleport to your home.
     */
    async teleportHome(): Promise<null> {
        return this.call<null>("teleportHome");
    }

    /**
     * Stop looking at a character.
     */
    async unlook(): Promise<null> {
        return this.look(this.id);
    }

    /**
     * Sync a profile with your current details.
     * @param profileId The ID of the profile to sync.
     */
    async updateProfile(profileId: string): Promise<null> {
        return this.call<null>("updateProfile", { profileId });
    }

    /**
     * Sync a room with its current details.
     * @param profileId The ID of the room to sync.
     */
    async updateRoomProfile(profileId: string): Promise<null> {
        return this.call<null>("updateRoomProfile", { profileId });
    }

    /**
     * Use an exit.
     * @param exitId The ID of the exit to use.
     */
    async useExit(exitId: string): Promise<null> {
        return this.call<null>("useExit", { exitId });
    }

    /**
     * Apply a profile.
     * @param profileId The ID of the profile to use.
     * @param safe If a check should be made to ensure the character info is stored in a profile.
     */
    async useProfile(profileId: string, safe = true): Promise<Record<"profile", NameBasicResponse>> {
        return this.call<Record<"profile", NameBasicResponse>>("useProfile", { profileId, safe });
    }

    /**
     * Apply a room profile. You must own the room and be in it.
     * @param profileId The ID of the room profile to use.
     * @param safe If a check should be made to ensure the current room info is stored in a profile.
     */
    async useRoomProfile(profileId: string, safe = true): Promise<Record<"profile", NameBasicResponse>> {
        return this.call<Record<"profile", NameBasicResponse>>("useRoomProfile", { profileId, safe });
    }

    /**
     * Wake up this character.
     * @param hidden If the character should be hidden from the awake list. Only applicable to bots.
     * @param force Ignore the character already being awake.
     */
    async wakeup(hidden?: boolean, force = false): Promise<null> {
        if (force && this.state === "awake") return null;
        return this.call<null>("wakeup", { hidden });
    }

    /**
     * Send a whisper to a character. You must be in the same room as them.
     * @param charId The ID of the character to whisper to.
     * @param options The options for the whisper.
     */
    async whisper(charId: string, options: Commands.ControlledCharacter.WhisperOptions): Promise<null> {
        return this.call<null>("whisper", { charId, ...options });
    }
}

export default ControlledCharacter;
