import type { IdleState } from "./Constants.js";
import type { Messages } from "./types.js";
import type Bot from "../models/Bot.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type Player from "../models/Player.js";
import type User from "../models/User.js";
import type CharacterDetails from "../models/CharacterDetails.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type Puppet from "../models/Puppet.js";
import type Room from "../models/Room.js";
import type Character from "../models/Character.js";
import type SafeUser from "../models/SafeUser.js";
import type Area from "../models/Area.ts";
import type Profile from "../models/Profile.ts";
import type RoomCharacter from "../models/RoomCharacter.ts";
import type BaseModel from "../models/BaseModel.ts";
import type CharacterMin from "../models/CharacterMin.ts";
import type Node from "../models/Node.ts";
import type Exit from "../models/Exit.ts";
import type Request from "../models/Request.ts";
import type RoomProfile from "../models/RoomProfile.ts";
import type Note from "../models/Note.ts";
import type Tag from "../models/Tag.ts";
import type TagGroup from "../models/TagGroup.ts";
import type RoomScript from "../models/RoomScript.ts";
import type Notice from "../models/Notice.ts";
import { type TagPref } from "../models/CharacterTags.ts";
import type RoomDetails from "../models/RoomDetails.ts";
import type AfarRoom from "../models/AfarRoom.ts";
import type { MessageEvent } from "ws";
import type { AnyObject } from "resclient-ts";

export interface ControlledCharacterEvents {
    /** Emitted when a character is controlled. */
    "controlledCharacters.add": [ctrl: ControlledCharacter];
    /** Emitted when a character is released. */
    "controlledCharacters.remove": [ctrl: ControlledCharacter];
    "exits.add": [ctrl: ControlledCharacter, room: RoomDetails, exit: Exit];
    "exits.change": [ctrl: ControlledCharacter, room: RoomDetails, exit: Exit, data: Partial<Exit>];
    "exits.remove": [ctrl: ControlledCharacter, room: RoomDetails, exit: Exit];
    /** Emitted when what a controlled character is looking at is changed. */
    "lookAtChange": [ctrl: ControlledCharacter, char: CharacterDetails | null, oldChar: CharacterDetails | null];
    /** Emitted when a character looks at a controlled character. */
    "lookedAt.add": [ctrl: ControlledCharacter, char: Character];
    /** Emitted when a character stops looking at a controlled character. */
    "lookedAt.remove": [ctrl: ControlledCharacter, char: Character];
    /** Emitted when a character enters the room a controlled character is in. */
    "roomCharacters.add": [char: ControlledCharacter, room: RoomDetails, roomChar: RoomCharacter];
    /** Emitted when a character enters a room adjacent to the room a controlled character is in, where the exit to the room they entered is transparent. */
    "roomCharacters.exit.add": [char: ControlledCharacter, room: AfarRoom, exit: Exit, char: Character];
    /** Emitted when a character leaves a room adjacent to the room a controlled character is in, where the exit to the room they entered is transparent. */
    "roomCharacters.exit.remove": [ctrl: ControlledCharacter, room: AfarRoom, exit: Exit, char: Character];
    /** Emitted when a character leaves the room a controlled character is in. */
    "roomCharacters.remove": [ctrl: ControlledCharacter, room: RoomDetails, roomChar: RoomCharacter];
    /** Emitted when a room profile is added for an owned character. */
    "roomProfiles.add": [ctrl: ControlledCharacter, room: Room, roomProfile: RoomProfile];
    /** Emitted when a room profile is removed for an owned character. */
    "roomProfiles.remove": [ctrl: ControlledCharacter, room: Room, roomProfile: RoomProfile];
    /** Emitted when a room script is added for an owned character. */
    "roomScripts.add": [ctrl: ControlledCharacter, room: Room, roomScript: RoomScript];
    /** Emitted when a room script is removed for an owned character. */
    "roomScripts.remove": [ctrl: ControlledCharacter, room: Room, roomScript: RoomScript];
}

export interface OwnedCharacterEvents {
    /** Emitted when a teleport node is added. */
    "characterNodes.add": [char: OwnedCharacter, node: Node];
    /** Emitted when a teleport node is removed. */
    "characterNodes.remove": [char: OwnedCharacter, node: Node];
    /** Emitted when a message is sent or received. */
    "message": AnyMessageEvent;
    /** Emitted when an area is created for an owned character. */
    "ownedAreas.add": [ctrl: OwnedCharacter, area: Area];
    /** Emitted when an area is deleted for an owned character. */
    "ownedAreas.remove": [ctrl: OwnedCharacter, area: Area];
    /** Emitted when an owned character is created. */
    "ownedCharacters.add": [char: OwnedCharacter];
    /** Emitted when an owned character is deleted. */
    "ownedCharacters.remove": [char: OwnedCharacter];
    /** Emitted when a room is created for an owned character. */
    "ownedRooms.add": [ctrl: OwnedCharacter, room: Room];
    /** Emitted when a room is deleted for an owned character. */
    "ownedRooms.remove": [ctrl: OwnedCharacter, room: Room];
    /** Emitted when a profile is created for an owned character. */
    "profiles.add": [ctrl: OwnedCharacter, profile: Profile];
    /** Emitted when a profile is deleted for an owned character. */
    "profiles.remove": [ctrl: OwnedCharacter, profile: Profile];
    /** Emitted when a puppet is added. */
    "puppets.add": [char: OwnedCharacter, puppet: Puppet];
    /** Emitted when a puppet is removed. */
    "puppets.remove": [char: OwnedCharacter, puppet: Puppet];
    /** Emitted when an owned character's room changes (where the character is located, not the details of the room). */
    "roomChange": [char: OwnedCharacter, room: Room, oldRoom: Room];
}

export interface CharacterEvents {
    /** Emitted when a character wakes up. */
    "awakeCharacters.add": [char: Character];
    /** Emitted when a character goes to sleep. */
    "awakeCharacters.remove": [char: Character];
    "characterTags.add": [char: Character, tag: Tag, pref: TagPref];
    "characterTags.remove": [char: Character, tag: Tag, pref: TagPref];
    /** Emitted when a character's idle status changes. */
    "idleStatusChange": [char: Character, status: IdleState, oldStatus: IdleState];
}

export interface PlayerEvents {
    "mutedCharacters.add": [char: CharacterMin];
    "mutedCharacters.remove": [char: CharacterMin];
    "notes.add": [note: Note, char: Character];
    "notes.remove": [note: Note, char: Character];
    "notes.textChange": [note: Note, char: Character, text: string, oldText: string];
    "requests.incoming.accepted": [request: Request];
    "requests.incoming.add": [request: Request];
    "requests.incoming.expired": [request: Request];
    "requests.incoming.failed": [request: Request];
    "requests.incoming.rejected": [request: Request];
    "requests.incoming.remove": [request: Request];
    "requests.incoming.revoked": [request: Request];
    "requests.outgoing.accepted": [request: Request];
    "requests.outgoing.add": [request: Request];
    "requests.outgoing.expired": [request: Request];
    "requests.outgoing.failed": [request: Request];
    "requests.outgoing.rejected": [request: Request];
    "requests.outgoing.remove": [request: Request];
    "requests.outgoing.revoked": [request: Request];
}

export interface UserEvents {
    "notices.add": [notice: Notice];
    "notices.remove": [notice: Notice];
}

export interface MiscEvents {
    /** Emitted when a global teleport node is added. */
    "globalTeleports.add": [node: Node];
    /** Emitted when a global teleport node is removed. */
    "globalTeleports.remove": [node: Node];
    /** Emitted when a collection is seen that a class is not registered for. */
    missingCollection: [rid: string];
    /** Emitted when an error is seen that a class is not registered for. By default no error classes are registered*/
    missingError: [rid: string];
    /** Emitted when a model is seen that a class is not registered for. */
    missingModel: [rid: string];
    /** Emitted when a model is seen with properties that are not contained in its definition. */
    missingProperties: [model: BaseModel, properties: Array<string>, data: AnyObject];
    "tagGroups.add": [tagGroup: TagGroup];
    "tagGroups.remove": [tagGroup: TagGroup];
    "tags.add": [tag: Tag];
    "tags.remove": [tag: Tag];
}

export interface ClientEvents {
    connected: [user: User, player: Player] | [user: SafeUser, player: null] | [bot: Bot, player: null];
    /** Emitted when the client is manually disconnected. */
    disconnected: [];
    error: [error: unknown];
    raw: [data: MessageEvent];
    /** Emitted when the client's Player/Bot is forcefully unsubscribed. */
    unsubscribe: [];
}

export type Events = ClientEvents & MiscEvents & CharacterEvents & OwnedCharacterEvents & ControlledCharacterEvents & PlayerEvents & UserEvents;


export type BaseMessageEvent<T extends Messages.MessageTypes> = [type: T, sent: boolean, to: ControlledCharacter];
export type WakeupMessageEvent = [...BaseMessageEvent<"wakeup">, from: Character, msg: string, method: string];
export type SleepMessageEvent = [...BaseMessageEvent<"sleep">, from: Character, msg: string, method: string];
export type TravelMessageEvent = [...BaseMessageEvent<"travel">, from: Character, msg: string, targetRoom: Messages.Travel["targetRoom"], method: string];
export type SayMessageEvent = [...BaseMessageEvent<"say">, from: Character, msg: string];
export type PoseMessageEvent = [...BaseMessageEvent<"pose">, from: Character, msg: string];
export type OOCMessageEvent = [...BaseMessageEvent<"ooc">, from: Character, msg: string, pose: boolean];
export type AddressMessageEvent = [...BaseMessageEvent<"address">, from: Character, msg: string, target: Character, pose: boolean, ooc: boolean];
export type WhisperMessageEvent = [...BaseMessageEvent<"whisper">, from: Character, msg: string, target: Character, pose: boolean, ooc: boolean];
export type MailMessageEvent = [...BaseMessageEvent<"mail">, from: Character, msg: string, target: Character, pose: boolean, ooc: boolean];
export type MessageMessageEvent = [...BaseMessageEvent<"message">, from: Character, msg: string, target: Character, pose: boolean, ooc: boolean];
export type ActionMessageEvent = [...BaseMessageEvent<"action">, from: Character, msg: string];
export type DescribeMessageEvent = [...BaseMessageEvent<"describe">, from: Character, msg: string];
export type PrivateDescribeMessageEvent = [...BaseMessageEvent<"privateDescribe">, msg: string, target: Character, script: string];
export type InfoMessageEvent = [...BaseMessageEvent<"info">, msg: string];
export type RollMessageEvent = [...BaseMessageEvent<"roll">, from: Character, total: number, result: Messages.Roll["result"], quiet: boolean];
export type LeaveMessageEvent = [...BaseMessageEvent<"leave">, from: Character, msg: string, method: string];
export type ArriveMessageEvent = [...BaseMessageEvent<"arrive">, from: Character, msg: string, method: string];
export type AnyMessageEvent = WakeupMessageEvent | SleepMessageEvent | TravelMessageEvent | SayMessageEvent | PoseMessageEvent | OOCMessageEvent | AddressMessageEvent | WhisperMessageEvent | MailMessageEvent | MessageMessageEvent | ActionMessageEvent | DescribeMessageEvent | PrivateDescribeMessageEvent | InfoMessageEvent | RollMessageEvent | LeaveMessageEvent | ArriveMessageEvent;
