import type { IdleState } from "./Constants.js";
import type { AreaDetailsPopulationUpdate, Messages, PublicPopulationUpdate } from "./types.js";
import type BotUser from "../models/BotUser.ts";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type Player from "../models/Player.js";
import type User from "../models/User.js";
import type CharacterDetails from "../models/CharacterDetails.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type Puppet from "../models/Puppet.js";
import type Room from "../models/Room.js";
import type Character from "../models/Character.js";
import type TokenUser from "../models/TokenUser.ts";
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
import type PlayerMailMessage from "../models/PlayerMailMessage.ts";
import type Bot from "../models/Bot.ts";
import type Token from "../models/Token.ts";
import type Watch from "../models/Watch.ts";
import type RoomCommand from "../models/RoomCommand.ts";
import { type FocusOptions } from "../models/Focus.ts";
import type AreaDetails from "../models/AreaDetails.ts";
import type AreaChild from "../models/AreaChild.ts";
import type RoomChild from "../models/RoomChild.ts";
import type { MessageEvent } from "ws";
import type { AnyObject, ResRef } from "resclient-ts";

export interface ControlledCharacterEvents {
    /** Emitted when the population changes in an area contained within the immediate area of a controlled character. */
    "area.child.populationChange": [ctrl: ControlledCharacter, area: AreaChild, update: PublicPopulationUpdate];
    /** Emitted when the the population changes in the immediate area of a controlled character. */
    "area.details.populationChange": [ctrl: ControlledCharacter, area: AreaDetails, update: AreaDetailsPopulationUpdate];
    /** Emitted when a teleport node is added. */
    "characterNodes.add": [char: ControlledCharacter, node: Node];
    /** Emitted when a teleport node is removed. */
    "characterNodes.remove": [char: ControlledCharacter, node: Node];
    "exits.add": [ctrl: ControlledCharacter, room: RoomDetails, exit: Exit];
    "exits.hidden.add": [ctrl: ControlledCharacter, room: RoomDetails, exit: Exit];
    "exits.hidden.remove": [ctrl: ControlledCharacter, room: RoomDetails, exit: Exit];
    "exits.remove": [ctrl: ControlledCharacter, room: RoomDetails, exit: Exit];
    "focus.add": [ctrl: ControlledCharacter, options: FocusOptions, ref: ResRef<Character>];
    "focus.remove": [ctrl: ControlledCharacter, options: FocusOptions, ref: ResRef<Character>];
    "focusChars.add": [ctrl: ControlledCharacter, char: CharacterMin, options: FocusOptions];
    "focusChars.remove": [ctrl: ControlledCharacter, char: CharacterMin, options: FocusOptions];
    /** Emitted when what a controlled character is looking at is changed. */
    "lookAtChange": [ctrl: ControlledCharacter, char: CharacterDetails | null, oldChar: CharacterDetails | null];
    /** Emitted when a character looks at a controlled character. */
    "lookedAt.add": [ctrl: ControlledCharacter, char: Character];
    /** Emitted when a character stops looking at a controlled character. */
    "lookedAt.remove": [ctrl: ControlledCharacter, char: Character];
    /** Emitted when a message is sent or received. */
    "message": AnyMessageEvent;
    /** Emitted when an area is created for an owned character. */
    "ownedAreas.add": [ctrl: ControlledCharacter, area: Area];
    /** Emitted when an area is deleted for an owned character. */
    "ownedAreas.remove": [ctrl: ControlledCharacter, area: Area];
    /** Emitted when a room is created for an owned character. */
    "ownedRooms.add": [ctrl: ControlledCharacter, room: Room];
    /** Emitted when a room is deleted for an owned character. */
    "ownedRooms.remove": [ctrl: ControlledCharacter, room: Room];
    /** Emitted when a profile is created for an owned character. */
    "profiles.add": [ctrl: ControlledCharacter, profile: Profile];
    /** Emitted when a profile is deleted for an owned character. */
    "profiles.remove": [ctrl: ControlledCharacter, profile: Profile];
    /** Emitted when the population changes in a room contained within the immediate area of a controlled character. */
    "room.child.populationChange": [ctrl: ControlledCharacter, room: RoomChild, update: PublicPopulationUpdate];
    /** Emitted when the population changes in the room a controlled character is in. */
    "room.details.populationChange": [ctrl: ControlledCharacter, room: RoomDetails, update: PublicPopulationUpdate];
    "roomChange.details": [ctrl: ControlledCharacter, room: RoomDetails, oldRoom: RoomDetails];
    /** Emitted when a character enters the room a controlled character is in. */
    "roomCharacters.add": [char: ControlledCharacter, room: RoomDetails, roomChar: RoomCharacter];
    /** Emitted when a character enters a room adjacent to the room a controlled character is in, where the exit to the room they entered is transparent. */
    "roomCharacters.exit.add": [char: ControlledCharacter, room: AfarRoom, exit: Exit, char: Character];
    /** Emitted when a character leaves a room adjacent to the room a controlled character is in, where the exit to the room they entered is transparent. */
    "roomCharacters.exit.remove": [ctrl: ControlledCharacter, room: AfarRoom, exit: Exit, char: Character];
    /** Emitted when a character leaves the room a controlled character is in. */
    "roomCharacters.remove": [ctrl: ControlledCharacter, room: RoomDetails, roomChar: RoomCharacter];
    "roomCommands.add": [ctrl: ControlledCharacter, room: RoomDetails, roomCommand: RoomCommand];
    "roomCommands.remove": [ctrl: ControlledCharacter, room: RoomDetails, roomCommand: RoomCommand];
    /** Emitted when a room profile is added for an owned character. */
    "roomProfiles.add": [ctrl: ControlledCharacter, room: RoomDetails, roomProfile: RoomProfile];
    /** Emitted when a room profile is removed for an owned character. */
    "roomProfiles.remove": [ctrl: ControlledCharacter, room: RoomDetails, roomProfile: RoomProfile];
    /** Emitted when a room script is added for an owned character. */
    "roomScripts.add": [ctrl: ControlledCharacter, room: RoomDetails, roomScript: RoomScript];
    /** Emitted when a room script is removed for an owned character. */
    "roomScripts.remove": [ctrl: ControlledCharacter, room: RoomDetails, roomScript: RoomScript];
}

export interface OwnedCharacterEvents {
    /** Emitted when an owned character's room changes (where the character is located, not the details of the room). */
    "roomChange": [char: OwnedCharacter, room: Room, oldRoom: Room];
}

export interface CharacterEvents {
    "aboutChange": [char: Character, about: string, oldAbout: string];
    /** Emitted when a character wakes up. */
    "awakeCharacters.add": [char: Character];
    /** Emitted when a character goes to sleep. */
    "awakeCharacters.remove": [char: Character];
    "characterTags.add": [char: Character, tag: Tag, pref: TagPref];
    "characterTags.remove": [char: Character, tag: Tag, pref: TagPref];
    /** Emitted when a character's idle status changes. */
    "idleStatusChange": [char: Character, status: IdleState, oldStatus: IdleState];
    "lfrp.change": [char: Character, lfrp: boolean];
    "lfrp.descChange": [char: Character, desc: string, oldDesc: string];
}

export interface PlayerEvents {
    "bots.add": [player: Player, bot: Bot];
    "bots.remove": [player: Player, bot: Bot];
    /** Emitted when a character is controlled. */
    "controlledCharacters.add": [player: Player, ctrl: ControlledCharacter];
    /** Emitted when a character is released. */
    "controlledCharacters.remove": [player: Player, ctrl: ControlledCharacter];
    "inbox.add": [player: Player, mail: PlayerMailMessage];
    "inbox.remove": [player: Player, mail: PlayerMailMessage];
    "mutedCharacters.add": [player: Player, char: CharacterMin];
    "mutedCharacters.remove": [player: Player, char: CharacterMin];
    "notes.add": [player: Player, note: Note, char: Character];
    "notes.remove": [player: Player, note: Note, char: Character];
    "notes.textChange": [player: Player, note: Note, char: Character, text: string, oldText: string];
    "notices.auth.add": [player: Player, notice: Notice];
    "notices.auth.remove": [player: Player, notice: Notice];
    "notices.identity.add": [player: Player, notice: Notice];
    "notices.identity.remove": [player: Player, notice: Notice];
    /** Emitted when an owned character is created. */
    "ownedCharacters.add": [player: Player, char: OwnedCharacter];
    /** Emitted when an owned character is deleted. */
    "ownedCharacters.remove": [player: Player, char: OwnedCharacter];
    /** Emitted when a puppet is added. */
    "puppets.add": [player: Player, puppet: Puppet];
    /** Emitted when a puppet is removed. */
    "puppets.remove": [player: Player, puppet: Puppet];
    "requests.incoming.accepted": [player: Player, request: Request];
    "requests.incoming.add": [player: Player, request: Request];
    "requests.incoming.expired": [player: Player, request: Request];
    "requests.incoming.failed": [player: Player, request: Request];
    "requests.incoming.rejected": [player: Player, request: Request];
    "requests.incoming.remove": [player: Player, request: Request];
    "requests.incoming.revoked": [player: Player, request: Request];
    "requests.outgoing.accepted": [player: Player, request: Request];
    "requests.outgoing.add": [player: Player, request: Request];
    "requests.outgoing.expired": [player: Player, request: Request];
    "requests.outgoing.failed": [player: Player, request: Request];
    "requests.outgoing.rejected": [player: Player, request: Request];
    "requests.outgoing.remove": [player: Player, request: Request];
    "requests.outgoing.revoked": [player: Player, request: Request];
    "tokens.add": [player: Player, token: Token];
    "tokens.remove": [player: Player, token: Token];
    "unreadMail.add": [player: Player, mail: PlayerMailMessage];
    "unreadMail.remove": [player: Player, mail: PlayerMailMessage];
    "watches.add": [player: Player, watch: Watch];
    "watches.remove": [player: Player, watch: Watch];
}

export interface MiscEvents {
    "broadcast": [msg: Messages.Broadcast];
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
    /** Emitted after the client has successfully authenticated. This is emitted before any tracking is setup. */
    "authenticated": [];
    /** Emitted after the client has successfully authenticated as a bot. This is emitted before any tracking is setup. */
    "authenticated.bot": [bot: BotUser];
    /** Emitted after the client has successfully authenticated as a player. This is emitted before any tracking is setup. */
    "authenticated.player": [user: User, player: Player];
    /** Emitted after the client has successfully authenticated as a management token. This is emitted before any tracking is setup. */
    "authenticated.token": [token: TokenUser];
    /** Emitted when the client is connected and ready. */
    "connected": [];
    /** Emitted when the client is connected and ready as a bot. */
    "connected.bot": [bot: BotUser];
    /** Emitted when the client is connected and ready as a player. */
    "connected.player": [user: User, player: Player];
    /** Emitted when the client is connected and ready as a management token. */
    "connected.token": [token: TokenUser];
    /** Emitted when the client is manually disconnected. */
    disconnected: [];
    error: [error: unknown];
    raw: [data: MessageEvent];
    /** Emitted when the client's Player/Bot is forcefully unsubscribed. */
    unsubscribe: [];
}

export interface Events extends ClientEvents, MiscEvents, CharacterEvents, OwnedCharacterEvents, ControlledCharacterEvents, PlayerEvents {}


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
