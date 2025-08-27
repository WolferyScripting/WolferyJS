import type Character from "../models/Character.ts";
import type CoreInfo from "../models/CoreInfo.ts";
import type MailInfo from "../models/MailInfo.ts";
import type NoteInfo from "../models/NoteInfo.ts";
import type ReportInfo from "../models/ReportInfo.ts";
import type SupportInfo from "../models/SupportInfo.ts";
import type TagInfo from "../models/TagInfo.ts";
import type WebClientInfo from "../models/WebClientInfo.ts";

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

export interface KeyNameResponse {
    key: string;
    name: string;
}
export type BasicCharacterResponse<K extends string> = Record<K, NameBasicResponse & {
    surname: string;
}>;

export type OptionalBasicCharacterResponse<K extends string> = {
    [T in K]?: NameBasicResponse & {
        surname: string;
    }
};

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
    export type MessageTypes = "wakeup" | "sleep" | "travel" | "say" | "pose" | "ooc" | "whisper" | "message" | "action" | "describe" | "mail" | "roll" | "leave" | "arrive" | "address" | "privateDescribe" | "info" | "broadcast";
    export type Any = Wakeup | Sleep | Travel | Say | Pose | OOC | Whisper | Message | Action | Describe | Mail | Roll | Leave | Arrive | Address | PrivateDescribe | Info | Broadcast;
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

    export interface Broadcast extends Base<"broadcast"> {
        msg: string;
        title?: string;
    }
}

export type NavDirections = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw" | "";
export type NavIcons = NavDirections | "up" | "down" | "in" | "out";
export type Roles = "builder" | "helper" | "moderator" | "admin";
export type Titles = "supporter" | "pioneer" | "overseer";
export type CharacterType = "player" | "puppet";
export type MailCharacterType = "char" | "puppet";
export type CharacterState = "awake" | "asleep";


export interface MoveMessages {
    arriveMsg: string;
    leaveMsg: string;
    travelMsg: string;
}

export interface RealmConfig {
    about: string;
    arrivalMsg: string;
    arrivalRoom: unknown;
    dazedMsg: string;
    defaultDoNotDisturbMsg: string;
    defaultHome: unknown;
    deleteCharMsg: string;
    exitTimeoutMsg: string;
    fallAsleepMsg: string;
    genre: string;
    greeting: string;
    notAPuppetMsg: string;
    puppetControlledByOtherMsg: string;
    quietMsg: string;
    recoverFromDazeMsg: string;
    rules: string;
    subgenre: string;
    summon: MoveMessages;
    sweepMsg: string;
    teleport: MoveMessages;
    teleportHome: MoveMessages;
    title: string;
    wakeUpMsg: string;
}

export interface Info {
    core: CoreInfo;
    mail: MailInfo;
    note: NoteInfo;
    report: ReportInfo;
    support: SupportInfo;
    tag: TagInfo;
    webClient: WebClientInfo;
}

interface RawCharacterInspection extends BasicCharacterResponse<"char"> {
    banMatches: Array<OptionalBasicCharacterResponse<"char"> & { banReason: string; banned: number; }>;
    banned: number | null;
    charCreated: number;
    playerJoined: number;
    trust: string;
}

export interface CharacterInspection {
    banMatches: Array<{ banReason: string; banned: number; char: Character | null; }>;
    banned: number | null;
    char: Character;
    charCreated: number;
    playerJoined: number;
    trust: Record<"trusted" | "npn" | "bannedIP", boolean>;
}


export interface UserIp {
    firstUsed: number;
    ip: string;
    lastUsed: number;
    used: number; // ?
}

export interface RealmConfigOverseer extends RealmConfig {
    adminMaxCharProfiles: number;
    adminMaxOwnedChars: number;
    adminMaxRoomProfiles: number;
    adminMaxRoomScripts: number;
    builderMaxOwnedAreas: number;
    builderMaxOwnedRooms: number;
    charNameMaxLength: number;
    charNameMinLength: number;
    charSurnameMaxLength: number;
    charSurnameMinLength: number;
    communicationMaxLength: number;
    descriptionMaxLength: number;
    itemNameMaxLength: number;
    keyMaxLength: number;
    maxCharProfiles: number;
    maxFollows: number;
    maxImageSize: number;
    maxListItems: number;
    maxOwnedAreas: number;
    maxOwnedChars: number;
    maxOwnedRooms: number;
    maxRoomCmds: number;
    maxRoomExits: number;
    maxRoomProfiles: number;
    maxRoomScripts: number;
    maxScheduledPosts: number;
    maxScriptBinarySize: number;
    propertyMaxLength: number;
    scriptMaxLength: number;
    shortDescriptionMaxLength: number;
    supporterMaxCharProfiles: number;
    supporterMaxImageSize: number;
    supporterMaxOwnedChars: number;
    supporterMaxRoomProfiles: number;
    supporterMaxRoomScripts: number;
}
