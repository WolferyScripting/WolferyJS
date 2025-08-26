import type { IdleStatus } from "./Constants.js";
import type Bot from "../models/Bot.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type Player from "../models/Player.js";
import type User from "../models/User.js";
import type CharacterDetails from "../models/CharacterDetails.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type Puppet from "../models/Puppet.js";
import type Room from "../models/Room.js";
import type RoomDetails from "../models/RoomDetails.js";
import type Character from "../models/Character.js";
import type SafeUser from "../models/SafeUser.js";
import type Area from "../models/Area.ts";
import type Profile from "../models/Profile.ts";
import type RoomCharacter from "../models/RoomCharacter.ts";
import type BaseModel from "../models/BaseModel.ts";
import type { MessageEvent } from "ws";

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export interface PasswordAuthentication {
    hash: string;
    hmac: string;
    type: "password";
    username: string;
}

export interface BotAuthentication {
    token: string;
    type: "bot";
}

export interface TokenAuthentication {
    token: string;
    type: "token";
}

export type BasicCharacterResponse<K extends string> = Record<K, NameBasicResponse & {
    surname: string;
}>;

export interface DeleteNameResponse extends NameBasicResponse {
    deleted: number;
}
export type NameBasicResponse = BasicResponse<"name">;
export type KeyBasicResponse = BasicResponse<"key">;
export type BasicResponse<K extends string> = {
    [key in K]: string;
} & { id: string; };

export interface LookupCharacter {
    awake: boolean;
    gender: string;
    id: string;
    lastAwake: number | null;
    name: string;
    species: string;
    surname: string;
}

export namespace Messages {
    export type Char = Record<"id" | "name" | "surname", string>;
    export type MessageTypes = "wakeup" | "sleep" | "travel" | "say" | "pose" | "ooc" | "whisper" | "message" | "action" | "describe" | "mail" | "roll" | "leave" | "arrive" | "address" | "privateDescribe" | "info";
    export type Any = Wakeup | Sleep | Travel | Say | Pose | OOC | Whisper | Message | Action | Describe | Mail | Roll | Leave | Arrive | Address | PrivateDescribe | Info;
    export interface Base<T extends MessageTypes = MessageTypes> {
        id: string;
        sig: string;
        time: number;
        type: T;
    }
    export interface BaseWithChar<T extends MessageTypes = MessageTypes> extends Base<T> {
        char: Char;
    }

    export interface Wakeup extends BaseWithChar<"wakeup"> {
        method: string;
        msg: string;
    }

    export interface Sleep extends BaseWithChar<"sleep"> {
        method: string;
        msg: string;
    }

    export interface Travel extends BaseWithChar<"travel"> {
        method: string;
        msg: string;
        targetRoom: Record<"id" | "name", string>;
    }

    export interface Say extends BaseWithChar<"say"> {
        msg: string;
    }

    export interface Pose extends BaseWithChar<"pose"> {
        msg: string;
    }

    export interface OOC extends BaseWithChar<"ooc"> {
        msg: string;
        pose?: true;
    }

    export interface Whisper extends BaseWithChar<"whisper"> {
        msg: string;
        ooc?: true;
        pose?: true;
        target: Char;
    }

    export interface Message extends BaseWithChar<"message"> {
        msg: string;
        ooc?: true;
        pose?: true;
        target: Char;
    }

    export interface Action extends BaseWithChar<"action"> {
        msg: string;
    }

    export interface Describe extends BaseWithChar<"describe"> {
        msg: string;
    }

    export interface Mail extends BaseWithChar<"mail"> {
        msg: string;
        ooc?: true;
        pose?: true;
        target: Char;
    }

    export interface Roll extends BaseWithChar<"roll"> {
        quiet?: true;
        result: Array<RollResultStd | RollResultMod>;
        total: number;
    }

    export interface RollResultStd {
        count: number;
        dice: Array<number>;
        op: "+" | "-";
        sides: number;
        type: "std";
    }

    export interface RollResultMod {
        op: "+" | "-";
        type: "mod";
        value: number;
    }

    export interface Leave extends BaseWithChar<"leave"> {
        method: string;
        msg: string;
    }

    export interface Arrive extends BaseWithChar<"arrive"> {
        method: string;
        msg: string;
    }

    export interface Address extends BaseWithChar<"address"> {
        msg: string;
        ooc?: boolean;
        pose?: boolean;
        target: Char;
    }

    export interface PrivateDescribe extends Base<"privateDescribe"> {
        msg: string;
        script: string;
        target: Char;
    }

    export interface Info extends Base<"info"> {
        msg: string;
    }
}

export type NavDirections = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
export type NavIcons = NavDirections | "up" | "down" | "in" | "out";
export type Roles = "builder" | "helper" | "moderator" | "admin";
export type IDRoles = "supporter" | "pioneer";

type BaseMessageEvent<T extends Messages.MessageTypes> = [type: T, sent: boolean, to: ControlledCharacter];
type WakeupMessageEvent = [...BaseMessageEvent<"wakeup">, from: Character, msg: string, method: string];
type SleepMessageEvent = [...BaseMessageEvent<"sleep">, from: Character, msg: string, method: string];
type TravelMessageEvent = [...BaseMessageEvent<"travel">, from: Character, msg: string, targetRoom: Messages.Travel["targetRoom"], method: string];
type SayMessageEvent = [...BaseMessageEvent<"say">, from: Character, msg: string];
type PoseMessageEvent = [...BaseMessageEvent<"pose">, from: Character, msg: string];
type OOCMessageEvent = [...BaseMessageEvent<"ooc">, from: Character, msg: string, pose: boolean];
type AddressMessageEvent = [...BaseMessageEvent<"address">, from: Character, msg: string, target: Character, pose: boolean, ooc: boolean];
type WhisperMessageEvent = [...BaseMessageEvent<"whisper">, from: Character, msg: string, target: Character, pose: boolean, ooc: boolean];
type MailMessageEvent = [...BaseMessageEvent<"mail">, from: Character, msg: string, target: Character, pose: boolean, ooc: boolean];
type MessageMessageEvent = [...BaseMessageEvent<"message">, from: Character, msg: string, target: Character, pose: boolean, ooc: boolean];
type ActionMessageEvent = [...BaseMessageEvent<"action">, from: Character, msg: string];
type DescribeMessageEvent = [...BaseMessageEvent<"describe">, from: Character, msg: string];
type PrivateDescribeMessageEvent = [...BaseMessageEvent<"privateDescribe">, msg: string, target: Character, script: string];
type InfoMessageEvent = [...BaseMessageEvent<"info">, msg: string];
type RollMessageEvent = [...BaseMessageEvent<"roll">, from: Character, total: number, result: Messages.Roll["result"], quiet: boolean];
type LeaveMessageEvent = [...BaseMessageEvent<"leave">, from: Character, msg: string, method: string];
type ArriveMessageEvent = [...BaseMessageEvent<"arrive">, from: Character, msg: string, method: string];
type AnyMessageEvent = WakeupMessageEvent | SleepMessageEvent | TravelMessageEvent | SayMessageEvent | PoseMessageEvent | OOCMessageEvent | AddressMessageEvent | WhisperMessageEvent | MailMessageEvent | MessageMessageEvent | ActionMessageEvent | DescribeMessageEvent | PrivateDescribeMessageEvent | InfoMessageEvent | RollMessageEvent | LeaveMessageEvent | ArriveMessageEvent;
export interface ClientEvents {
    /** Emitted when a character is added to the awake characters list. */
    awakeCharactersAdd: [char: Character];
    /** Emitted when a character is removed from the awake characters list. */
    awakeCharactersRemove: [char: Character];
    connected: [user: User, player: Player] | [user: SafeUser, player: null] | [bot: Bot, player: null];
    /** Emitted when a character is controlled. */
    controlledCharacterAdd: [ctrl: ControlledCharacter];
    /** Emitted when a character is released. */
    controlledCharacterRemove: [ctrl: ControlledCharacter];
    disconnected: [];
    error: [error: unknown];
    /** Emitted when a character's idle status changes. */
    idleStatusChange: [char: Character, status: IdleStatus, oldStatus: IdleStatus];
    /** Emitted when what a controlled character is looking at is changed. */
    lookAtChange: [ctrl: ControlledCharacter, char: CharacterDetails | null, oldChar: CharacterDetails | null];
    /** Emitted when a character looks at a controlled character. */
    lookedAtAdd: [ctrl: ControlledCharacter, char: Character];
    /** Emitted when a character stops looking at a controlled character. */
    lookedAtRemove: [ctrl: ControlledCharacter, char: Character];
    /** Emitted when a message is sent or received. */
    message: AnyMessageEvent;
    /** Emitted when a collection is seen that a class is not registered for. */
    missingCollection: [rid: string];
    /** Emitted when an error is seen that a class is not registered for. By default no error classes are registered*/
    missingError: [rid: string];
    /** Emitted when a model is seen that a class is not registered for. */
    missingModel: [rid: string];
    missingProperties: [model: BaseModel, properties: Array<string>];
    /** Emitted when an area is created for a controlled character. */
    ownedAreaAdd: [ctrl: ControlledCharacter, area: Area];
    /** Emitted when an area is deleted for a controlled character. */
    ownedAreaRemove: [ctrl: ControlledCharacter, area: Area];
    /** Emitted when an owned character is created. */
    ownedCharacterAdd: [char: OwnedCharacter];
    /** Emitted when an owned character is deleted. */
    ownedCharacterRemove: [char: OwnedCharacter];
    /** Emitted when a room is created for a controlled character. */
    ownedRoomAdd: [ctrl: ControlledCharacter, room: Room];
    /** Emitted when a room is deleted for a controlled character. */
    ownedRoomRemove: [ctrl: ControlledCharacter, room: Room];
    /** Emitted when a profile is created for a controlled character. */
    profileAdd: [ctrl: ControlledCharacter, profile: Profile];
    /** Emitted when a profile is deleted for a controlled character. */
    profileRemove: [ctrl: ControlledCharacter, profile: Profile];
    puppetAdd: [puppet: Puppet];
    puppetRemove: [puppet: Puppet];
    raw: [data: MessageEvent];
    /** Emitted when an owned or controlled character's room changes (the room itself, not its details). */
    roomChange: [char: OwnedCharacter, room: Room, oldRoom: Room] | [ctrl: ControlledCharacter, room: RoomDetails, oldRoom: RoomDetails];
    roomCharacterAdd: [char: RoomCharacter];
    roomCharacterAddAwake: [char: Character];
    roomCharacterRemove: [char: RoomCharacter];
    roomCharacterRemoveAwake: [char: Character];
    /** Emitted when the client's Player/Bot is forcefully unsubscribed. */
    unsubscribe: [];
}
