
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
