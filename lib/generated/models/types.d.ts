/* eslint-disable @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/member-ordering, key-spacing, unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars, import/order, import-newlines/enforce */
import type { ResError, ResRef } from "resclient-ts";
import type RoomCharactersAwake from "../../collections/RoomCharactersAwake.js";
import type AreaChildren from "../../models/AreaChildren.js";
import type Image from "../../models/Image.js";
import type Character from "../../models/Character.js";
import type AreaDetails from "../../models/AreaDetails.js";
import type OwnedCharacter from "../../models/OwnedCharacter.js";
import type ControlledCharacter from "../../models/ControlledCharacter.js";
import type CharacterTags from "../../models/CharacterTags.js";
import type Room from "../../models/Room.js";
import type RoomDetails from "../../models/RoomDetails.js";
import type LookedAt from "../../models/LookedAt.js";
import type LookAt from "../../models/LookAt.js";
import type CharacterNodes from "../../collections/CharacterNodes.js";
import type OwnedAreas from "../../collections/OwnedAreas.js";
import type OwnedRooms from "../../collections/OwnedRooms.js";
import type Profiles from "../../collections/Profiles.js";
import type PuppetInfo from "../../models/PuppetInfo.js";
import type Settings from "../../models/Settings.js";
import type AfarRoom from "../../models/AfarRoom.js";
import type CharacterDetails from "../../models/CharacterDetails.js";
import type OwnedCharacters from "../../collections/OwnedCharacters.js";
import type ControlledCharacters from "../../collections/ControlledCharacters.js";
import type MutedCharacters from "../../models/MutedCharacters.js";
import type Puppets from "../../collections/Puppets.js";
import type MailMessage from "../../models/MailMessage.js";
import type RequestParams from "../../models/RequestParams.js";
import type Area from "../../models/Area.js";
import type RoomCharacters from "../../collections/RoomCharacters.js";
import type RoomCommands from "../../models/RoomCommands.js";
import type Exits from "../../collections/Exits.js";
import type ScriptBinary from "../../models/ScriptBinary.js";
import type ScriptLogs from "../../collections/ScriptLogs.js";
import type Focus from "../../models/Focus.js";
import type Triggers from "../../collections/Triggers.js";
import type Identity from "../../models/Identity.js";
import type { IdleState } from "../../util/Constants.js";
import type { CharacterState, CharacterType, NavIcons, NavDirections, IDRoles, Roles, MailCharacterType } from "../../util/types.js";

/** A partial room seen as an exit target. */
export interface AfarRoomProperties {
    /** The characters in the room that are awake. */
    awake: RoomCharactersAwake | null;
    /** The unique identifier of the room. */
    id: string;
    /** The name of the room. */
    name: string;
}

/** An area. */
export interface AreaProperties {
    /** The unique identifier of the area. */
    id: string;
    /** The name of the area. */
    name: string;
}

/** A child of an area. */
export interface AreaChildProperties {
    /** The unique identifier of the area child. */
    id: string;
    /** The X coordinate on the map. */
    mapX: number;
    /** The Y coordinate on the map. */
    mapY: number;
    /** The name of the area child. */
    name: string;
    /** The population of the area child. */
    pop: number;
    /** A short description of the area child. */
    shortDesc: string;
    /** The type of the area child. */
    type: "area";
}

/** The child areas of an area. */
export interface AreaChildrenProperties {}

/** A detailed area, seen by a controlled character. */
export interface AreaDetailsProperties {
    /** The about of the area. */
    about: string;
    /** The child areas of the area. */
    children: AreaChildren;
    /** The unique identifier of the area. */
    id: string;
    /** The image of the area. */
    image: Image | null;
    /** The X coordinate on the map. */
    mapX: number;
    /** The Y coordinate on the map. */
    mapY: number;
    /** The name of the area. */
    name: string;
    /** The owner of the area. */
    owner: Character;
    /** The parent area. */
    parent: AreaDetails | null;
    /** The population of the area. */
    pop: number;
    /** Whether the area is private. */
    private: boolean;
    /** The privacy level of the area. */
    prv: number;
    /** The rules of the area. */
    rules: string;
    /** A short description of the area. */
    shortDesc: string;
}

/** The awake characters in the realm. */
export interface AwakeCharactersProperties {}

/** The user when logged in with a bot token. */
export interface BotUserProperties {
    /** The owned character of the bot. */
    char: OwnedCharacter;
    /** The controlled character of the bot. */
    controlled: ControlledCharacter | null;
}

/** A character */
export interface CharacterProperties {
    /** The avatar of the character. */
    avatar: string;
    /** Whether the character is awake. */
    awake: boolean;
    /** The deletion timestamp of the character. */
    deleted: number | null;
    /** The gender of the character. */
    gender: string;
    /** The unique identifier of the character. */
    id: string;
    /** The idle state of the character. */
    idle: IdleState;
    /** The last awake timestamp of the character. */
    lastAwake: number;
    /** The name of the character. */
    name: string;
    /** The puppeteer of the character. */
    puppeteer: Character | null;
    /** The RP status of the character. */
    rp: "lfrp" | "";
    /** The species of the character. */
    species: string;
    /** The state of the character. */
    state: CharacterState;
    /** The status of the character. */
    status: string;
    /** The surname of the character. */
    surname: string;
    /** The tags associated with the character. */
    tags: CharacterTags;
    /** The type of the character. */
    type: CharacterType;
}

/** A character with extra details, seen when looking at a character. */
export interface CharacterDetailsProperties {
    /** About the character. */
    about: string;
    /** The avatar of the character. */
    avatar: string;
    /** The description of the character. */
    desc: string;
    /** The gender of the character. */
    gender: string;
    /** The unique identifier of the character. */
    id: string;
    /** The idle state of the character. */
    idle: IdleState;
    /** The image of the character. */
    image: Image | null;
    /** The name of the character. */
    name: string;
    /** The species of the character. */
    species: string;
    /** The state of the character. */
    state: CharacterState;
    /** The status of the character. */
    status: string;
    /** The surname of the character. */
    surname: string;
    /** The tags associated with the character. */
    tags: CharacterTags;
    /** The type of the character. */
    type: CharacterType;
}

/** Extra info about a character. Reliability of lfrpDesc seems patchy at best. */
export interface CharacterInfoProperties {
    /** About the character. */
    about: string;
    /** The LFRP description of the character. */
    lfrpDesc: string;
}

/** A minimal character, seen in the list of muted and focused characters. */
export interface CharacterMinProperties {
    /** The avatar of the character. */
    avatar: string;
    /** The gender of the character. */
    gender: string;
    /** The unique identifier of the character. */
    id: string;
    /** The name of the character. */
    name: string;
    /** The species of the character. */
    species: string;
    /** The surname of the character. */
    surname: string;
}

/** A controlled character. */
export interface ControlledCharacterProperties {
    /** About the character. */
    about: string;
    /** The avatar of the character. */
    avatar: string;
    /** The timestamp when control started. */
    ctrlSince: number;
    /** Whether the character has custom teleport messages enabled. */
    customTeleportMsgs: boolean;
    /** The description of the character. */
    desc: string;
    /** The gender of the character. */
    gender: string;
    /** The home room of the character. */
    home: Room;
    /** The unique identifier of the character. */
    id: string;
    /** The idle state of the character. */
    idle: IdleState;
    /** The image of the character. */
    image: Image | null;
    /** The room the character is currently in. */
    inRoom: RoomDetails;
    /** The LFRP description of the character. */
    lfrpDesc: string | null;
    /** Information about who is looking at the character. */
    lookedAt: LookedAt;
    /** Information about who the character is looking at. */
    lookingAt: LookAt | null;
    /** The name of the character. */
    name: string;
    /** The nodes associated with the character. */
    nodes: CharacterNodes;
    /** The areas owned by the character. */
    ownedAreas: OwnedAreas;
    /** The rooms owned by the character. */
    ownedRooms: OwnedRooms;
    /** The profiles associated with the character. */
    profiles: Profiles;
    /** The puppeteer controlling the character, if any. */
    puppeteer: Character | null;
    /** Information about the character's puppet, if any. */
    puppetInfo: PuppetInfo | null;
    /** The roleplay style of the character. */
    rp: "lfrp" | "";
    /** The settings associated with the character. */
    settings: Settings;
    /** The species of the character. */
    species: string;
    /** The state of the character. */
    state: CharacterState;
    /** The status of the character. */
    status: string;
    /** The surname of the character. */
    surname: string;
    /** The tags associated with the character. */
    tags: CharacterTags;
    /** The message displayed when the character arrives via teleportation. */
    teleportArriveMsg: string;
    /** The message displayed when the character leaves via teleportation. */
    teleportLeaveMsg: string;
    /** The message displayed during the character's teleportation travel. */
    teleportTravelMsg: string;
    /** The type of the character. */
    type: CharacterType;
}

/** An exit. */
export interface ExitProperties {
    /** The icon representing the exit direction. */
    icon: NavIcons;
    /** The unique identifier of the exit. */
    id: string;
    /** The keys associated with the exit. */
    keys: Array<string>;
    /** The name of the exit. */
    name: string;
    /** The navigation direction of the exit. */
    nav: NavDirections;
    /** The target room of the exit. */
    target: AfarRoom | null;
    /** The ID of the target room. */
    targetId: string;
}

/** A detailed exit. */
export interface ExitDetailsProperties {
    /** The message seen by the target room. */
    arriveMsg: string;
    /** The timestamp when the exit was created. */
    created: number;
    /** Whether the exit is hidden. */
    hidden: boolean;
    /** The icon representing the exit direction. */
    icon: NavIcons;
    /** The unique identifier of the exit. */
    id: string;
    /** Whether the exit is inactive. */
    inactive: boolean;
    /** The keys associated with the exit. */
    keys: Array<string>;
    /** The message seen when leaving through the exit. */
    leaveMsg: string;
    /** The name of the exit. */
    name: string;
    /** The navigation direction of the exit. */
    nav: NavDirections;
    /** The target room of the exit. */
    targetRoom: Room;
    /** Whether the exit is transparent. */
    transparent: boolean;
    /** The message displayed during travel through the exit. */
    travelMsg: string;
}

/** The focus options for a character. */
export interface FocusProperties {}

/** The characters being focused on. */
export interface FocusCharsProperties {}

/** The logged in player's identity. */
export interface IdentityProperties {
    /** Whether the user allows newsletters. */
    allowNewsletter: boolean;
    /** The timestamp when the identity was created. */
    created: number;
    /** The email address of the user. */
    email: string | null;
    /** Whether the user's email is verified. */
    emailVerified: boolean;
    /** Whether the user has login credentials. */
    hasLogin: boolean;
    /** Whether the user has an OpenID. */
    hasOpenId: boolean;
    /** The unique identifier of the identity. */
    id: string;
    /** The roles associated with the identity. */
    idRoles: Array<string>;
    /** The name of the user. */
    name: string;
    /** The OpenID provider, if any. */
    openIdProvider: string | null;
    /** The username of the user. */
    username: string;
}

/** An image. */
export interface ImageProperties {
    /** The filename of the image. */
    filename: string;
    /** The height of the image in pixels. */
    height: number;
    /** The URL or path to the image. */
    href: string;
    /** The MIME type of the image. */
    mime: string;
    /** The SHA-256 hash of the image file. */
    sha256: string;
    /** The size of the image file in bytes. */
    size: number;
    /** The width of the image in pixels. */
    width: number;
}

/** The character being looked at. */
export interface LookAtProperties {
    /** The character being looked at, if they are still in the room. */
    char: CharacterDetails | null;
    /** The unique identifier of the character being looked at. */
    charId: string;
    /** The character being looked at, if they are no longer in the room. */
    unseen: Character | null;
}

/** The characters looking at an owned character. */
export interface LookedAtProperties {}

/** A mail message. */
export interface MailMessageProperties {
    /** Out of character message flag. */
    ooc: boolean;
    /** Whether the message is a pose. */
    pose: boolean;
    /** The content of the mail message. */
    text: string;
}

/** The characters that are muted. */
export interface MutedCharactersProperties {}

/** A teleportation node. */
export interface NodeProperties {
    /** The unique identifier of the node. */
    id: string;
    /** The key associated with the node. */
    key: string;
    /** The room this node is associated with. */
    room: Room;
}

/** A note on a character. */
export interface NoteProperties {
    /** The character this note is about. */
    char: ResRef<Character>;
    /** The content of the note. */
    text: string;
}

/** All notes. */
export interface NotesProperties {}

/** An owned character. */
export interface OwnedCharacterProperties {
    /** The avatar unique identifier. */
    avatar: string;
    /** The timestamp when the character was created. */
    created: number;
    /** The description of the character. */
    desc: string;
    /** The gender of the character. */
    gender: string;
    /** The unique identifier of the character. */
    id: string;
    /** The idle state of the character. */
    idle: IdleState;
    /** The image associated with the character. */
    image: Image | null;
    /** The room the character is currently in. */
    inRoom: Room;
    /** The timestamp when the character was last awake. */
    lastAwake: number;
    /** The name of the character. */
    name: string;
    /** The settings for the character. */
    settings: Settings;
    /** The species of the character. */
    species: string;
    /** The current state of the character. */
    state: CharacterState;
    /** The status message of the character. */
    status: string;
    /** The surname of the character. */
    surname: string;
    /** The type of character. */
    type: CharacterType;
}

/** The logged in player. */
export interface PlayerProperties {
    /** The characters owned by the player. */
    chars: OwnedCharacters;
    /** The characters currently controlled by the player. */
    controlled: ControlledCharacters;
    /** The unique identifier of the player. */
    id: string;
    /** The characters muted by the player. */
    mutedChars: MutedCharacters;
    /** Whether the player wants notifications for events. */
    notifyOnEvent: boolean;
    /** Whether the player wants notifications for matches. */
    notifyOnMatched: boolean;
    /** Whether the player wants notifications for mentions. */
    notifyOnMention: boolean;
    /** Whether the player wants notifications for requests. */
    notifyOnRequests: boolean;
    /** Whether the player wants notifications for wakeup calls. */
    notifyOnWakeup: boolean;
    /** Whether the player wants notifications for watched characters. */
    notifyOnWatched: boolean;
    /** The puppets controlled by the player. */
    puppets: Puppets;
}

/** A mail message. */
export interface PlayerMailMessageProperties {
    /** The sender of the mail. */
    from: object;
    /** The mail message content. */
    message: MailMessage;
    /** The timestamp when the mail was read. */
    read: number | null;
    /** The timestamp when the mail was received. */
    received: number;
    /** The recipient of the mail. */
    to: object;
}

/** A character profile. */
export interface ProfileProperties {
    /** The unique identifier of the avatar image. */
    avatar: string;
    /** The gender of the character. */
    gender: string;
    /** The unique identifier of the profile. */
    id: string;
    /** The URL of the profile image. */
    image: string;
    /** The key associated with the profile. */
    key: string;
    /** The timestamp when the profile was last used. */
    lastUsed: number;
    /** The name of the character. */
    name: string;
    /** The species of the character. */
    species: string;
}

/** A puppet. */
export interface PuppetProperties {
    /** The character that has registered the puppet. */
    char: OwnedCharacter;
    /** The timestamp when the puppet was last used. */
    lastUsed: number;
    /** The character being puppeted. */
    puppet: Character;
    /** The timestamp when the puppet was registered. */
    registered: number;
    /** The settings for the puppet. */
    settings: Settings;
}

/** The info for a puppet. */
export interface PuppetInfoProperties {
    /** The bounding area of the puppet. @TODO unknown, only seen null */
    boundingArea: any;
    /** Instructions on how to play the puppet. */
    howToPlay: string;
}

/** A request for changing ownership of areas and rooms, creating exits, etc. */
export interface RequestProperties {
    /** The timestamp when the request was answered. */
    answered: number | null;
    /** The timestamp when the request was created. */
    created: number;
    /** Any error associated with the request. */
    error: Record<"code" | "message", string> | null;
    /** The timestamp when the request expires. */
    expires: number;
    /** The character who made the request. */
    from: Character;
    /** The unique identifier of the request. */
    id: string;
    /** The parameters for the request. */
    params: RequestParams;
    /** The current state of the request. */
    state: "pending" | "rejected" | "failed" | "accepted" | "expired" | "revoked";
    /** The character to whom the request is directed. */
    to: Character;
    /** The type of the request. */
    type: string;
}

/** The parameters for a request. */
export interface RequestParamsProperties {
    /** The area related to the request. */
    area: Area | ResError | null;
    /** The character that owns the request. */
    owner: Character;
    /** The room related to the request. */
    room: Room | ResError | null;
}

/** A room. */
export interface RoomProperties {
    /** The unique identifier of the room. */
    id: string;
    /** The name of the room. */
    name: string;
}

/** A character in the current room. */
export interface RoomCharacterProperties {
    /** The unique identifier of the character's avatar image. */
    avatar: string;
    /** The gender of the character. */
    gender: string;
    /** The unique identifier of the character. */
    id: string;
    /** The idle state of the character. */
    idle: IdleState;
    /** The name of the character. */
    name: string;
    /** The puppeteer controlling the character. */
    puppeteer: Character | null;
    /** The roleplay status of the character. */
    rp: "lfrp" | "";
    /** The species of the character. */
    species: string;
    /** The current state of the character. */
    state: CharacterState;
    /** The status message of the character. */
    status: string;
    /** The surname of the character. */
    surname: string;
    /** The type of the character. */
    type: CharacterType;
}

/** A child room of an area. */
export interface RoomChildProperties {
    /** The unique identifier of the child room. */
    id: string;
    /** The X coordinate of the child room on the map. */
    mapX: number;
    /** The Y coordinate of the child room on the map. */
    mapY: number;
    /** The name of the child room. */
    name: string;
    /** The population of the child room. */
    pop: number;
    /** The type of the child room. */
    type: "room" | "instanceRoom";
}

/** A command in a room. */
export interface RoomCommandProperties {
    /** The command object. */
    cmd: Record<"pattern" | "desc", string>;
    /** The unique identifier of the command. */
    id: string;
    /** The priority of the command. */
    priority: number;
}

/** The commands in a room. */
export interface RoomCommandsProperties {}

/** A detailed view of a room. */
export interface RoomDetailsProperties {
    /** The area this room belongs to. */
    area: AreaDetails | null;
    /** Whether autosweep is enabled. */
    autosweep: boolean;
    /** The delay for autosweep in seconds. */
    autosweepDelay: number;
    /** The characters present in the room. */
    chars: RoomCharacters | null;
    /** The commands available in the room. */
    cmds: RoomCommands;
    /** The description of the room. */
    desc: string;
    /** The exits from the room. */
    exits: Exits;
    /** The unique identifier of the room. */
    id: string;
    /** The image associated with the room. */
    image: Image | null;
    /** Whether the room is dark. */
    isDark: boolean;
    /** Whether the room is a home. */
    isHome: boolean;
    /** Whether the room is an instance. */
    isInstance: boolean;
    /** Whether the room is quiet. */
    isQuiet: boolean;
    /** Whether teleportation is allowed in the room. */
    isTeleport: boolean;
    /** Whether listening is enabled in the room. */
    listen: boolean;
    /** The X coordinate of the room on the map. */
    mapX: number;
    /** The Y coordinate of the room on the map. */
    mapY: number;
    /** The name of the room. */
    name: string;
    /** The owner of the room. */
    owner: Character;
    /** The population of the room. */
    pop: number;
    /** Whether the room is private (population hidden in area). */
    private: boolean;
}

/** A detailed view of a room instance. */
export interface RoomInstanceDetailsProperties {
    /** The area this room belongs to. */
    area: AreaDetails | null;
    /** Whether autosweep is enabled. */
    autosweep: boolean;
    /** The delay for autosweep in seconds. */
    autosweepDelay: number;
    /** The characters present in the room. */
    chars: RoomCharacters | null;
    /** The commands available in the room. */
    cmds: RoomCommands;
    /** The description of the room. */
    desc: string;
    /** The exits from the room. */
    exits: Exits;
    /** The unique identifier of the room. */
    id: string;
    /** The image associated with the room. */
    image: Image | null;
    /** The instance identifier of the room. */
    instanceId: string;
    /** Whether the room is dark. */
    isDark: boolean;
    /** Whether the room can be set as a home. */
    isHome: boolean;
    /** Whether the room is an instance. */
    isInstance: boolean;
    /** Whether the room is quiet. */
    isQuiet: boolean;
    /** Whether the room can be registered as a teleport node. */
    isTeleport: boolean;
    /** Whether listening is enabled in the room. */
    listen: boolean;
    /** The X coordinate of the room on the map. */
    mapX: number;
    /** The Y coordinate of the room on the map. */
    mapY: number;
    /** The name of the room. */
    name: string;
    /** The owner of the room. */
    owner: Character;
    /** The population of the room. */
    pop: number;
    /** Whether the room is private. */
    private: boolean;
}

/** A profile of a room. */
export interface RoomProfileProperties {
    /** The unique identifier of the profile. */
    id: string;
    /** The image associated with the profile. */
    image: string;
    /** The key of the profile. */
    key: string;
    /** The last time the profile was used. */
    lastUsed: number;
    /** The name of the profile. */
    name: string;
}

/** A room script. */
export interface RoomScriptProperties {
    /** Whether the script is active. */
    active: boolean;
    /** The time the script was created. */
    created: number;
    /** The unique identifier of the script. */
    id: string;
    /** The key of the script. */
    key: string;
    /** The time the script was last updated. */
    updated: number;
    /** The version of the script. */
    version: string;
}

/** A detailed room script. */
export interface RoomScriptDetailsProperties {
    /** Whether the script is active. */
    active: boolean;
    /** The address of the script. */
    address: string;
    /** The binary data of the script. */
    binary: ScriptBinary | null;
    /** The time the script was created. */
    created: number;
    /** The unique identifier of the script. */
    id: string;
    /** The key of the script. */
    key: string;
    /** The logs of the script. */
    logs: ScriptLogs;
    /** The room associated with the script. */
    room: Room;
    /** The target of the script. */
    target: string;
    /** The time the script was last updated. */
    updated: number;
    /** The version of the script. */
    version: string;
}

/** The user when logged in with a management token. */
export interface TokenUserProperties {
    /** The time the user was created. */
    created: number;
    /** The unique identifier of the user. */
    id: string;
    /** The roles assigned to the user. @TODO only seen null */
    roles: any;
    /** The trust of the user. @TODO never seen a non-empty value */
    trust: string;
}

/** The binary for a room script. */
export interface ScriptBinaryProperties {
    /** The name of the file. */
    filename: string;
    /** The URL to the binary. */
    href: string;
    /** The MIME type of the binary. */
    mime: string;
    /** The SHA-256 hash of the binary. */
    sha256: string;
    /** The size of the binary in bytes. */
    size: number;
}

/** A log for a room script. */
export interface ScriptLogProperties {
    /** The unique identifier of the log. */
    id: string;
    /** The level of the log. */
    lvl: string;
    /** The message of the log. */
    msg: string;
    /** The time the log was created. */
    time: number;
}

/** The settings for a character or puppet. */
export interface SettingsProperties {
    /** Do Not Disturb status. */
    dnd: boolean;
    /** The Do Not Disturb message. */
    dndMsg: string;
    /** The current focus. */
    focus: Focus;
    /** The LFRP description. */
    lfrpDesc: string;
    /** Whether messages are muted. */
    muteMessage: boolean;
    /** Whether OOC is muted. */
    muteOoc: boolean;
    /** Whether travel is muted. */
    muteTravel: boolean;
    /** Whether to notify on all messages. */
    notifyOnAll: boolean;
    /** The triggers associated with the settings. */
    triggers: Triggers;
}

/** A tag. */
export interface TagProperties {
    /** Whether the tag is custom. */
    custom: boolean;
    /** The description of the tag. */
    desc: string;
    /** The group of the tag. */
    group: string | null;
    /** The unique identifier of the tag. */
    id: string;
    /** The id role of the tag. */
    idRole: IDRoles | null;
    /** The key of the tag. */
    key: string;
    /** The role associated with the tag. */
    role: Roles | null;
}

/** The tags of a character. */
export interface CharacterTagsProperties {}

/** Unread mail. */
export interface UnreadMailProperties {}

/** The user when logging in with username/password. */
export interface UserProperties {
    /** The time the user was created. */
    created: number;
    /** The unique identifier of the user. */
    id: string;
    /** The identity associated with the user. */
    identity: Identity;
    /** The roles assigned to the user. @TODO only seen null */
    roles: any;
    /** The trust of the user. @TODO never seen a non-empty value */
    trust: string;
}

/** A watched character. */
export interface WatchProperties {
    /** The character being watched. */
    char: Character;
    /** The time the watch was created. */
    created: number;
    /** The list of watchers. */
    watchers: Array<string>;
}

/** Watched characters. */
export interface WatchesProperties {}

/** The globally available tags. */
export interface TagsProperties {}

/** A tag group. */
export interface TagGroupProperties {
    /** The key of the tag group. */
    key: string;
    /** The name of the tag group. */
    name: string;
    /** The order of the tag group. */
    order: number;
}

/** The tag groups. */
export interface TagGroupsProperties {}

/** The core info about the realm. */
export interface CoreInfoProperties {
    /** Information about the core realm. */
    about: string;
    /** The maximum number of character profiles an admin can have. */
    adminMaxCharProfiles: number;
    /** The maximum number of characters an admin can own. */
    adminMaxOwnedChars: number;
    /** The maximum number of room profiles an admin can have. */
    adminMaxRoomProfiles: number;
    /** The maximum number of room scripts an admin can have. */
    adminMaxRoomScripts: number;
    /** The maximum number of areas a builder can own. */
    builderMaxOwnedAreas: number;
    /** The maximum number of rooms a builder can own. */
    builderMaxOwnedRooms: number;
    /** The maximum length of communication. */
    communicationMaxLength: number;
    /** The maximum length of a description. */
    descriptionMaxLength: number;
    /** The genre of the realm. */
    genre: string;
    /** The greeting message of the realm. */
    greeting: string;
    /** The maximum length of an item name. */
    itemNameMaxLength: number;
    /** The maximum length of keys. */
    keyMaxLength: number;
    /** The maximum number of profiles a character can have. */
    maxCharProfiles: number;
    /** The maximum number of characters that can be following a single character. */
    maxFollows: number;
    /** The maximum allowed file size for uploaded images, in bytes. */
    maxImageSize: number;
    /** The maximum number of items allowed in a list. */
    maxListItems: number;
    /** The maximum number of areas a player can own. */
    maxOwnedAreas: number;
    /** The maximum number of characters a player can own. */
    maxOwnedChars: number;
    /** The maximum number of rooms a player can own. */
    maxOwnedRooms: number;
    /** The maximum number of exits a room can have. */
    maxRoomExits: number;
    /** The maximum number of profiles a room can have. */
    maxRoomProfiles: number;
    /** The maximum number of scripts a room can have. */
    maxRoomScripts: number;
    /** The maximum number of scheduled posts a user can have pending at once. */
    maxScheduledPosts: number;
    /** The maximum length for properties. */
    propertyMaxLength: number;
    /** The rules for the realm. */
    rules: string;
    /** The maximum length a script can be. */
    scriptMaxLength: number;
    /** The maximum length a short description field can be. */
    shortDescriptionMaxLength: number;
    /** The specific subgenre of the realm. */
    subgenre: string;
    /** The maximum number of character profiles a supporter player can have. */
    supporterMaxCharProfiles: number;
    /** The maximum allowed file size for uploaded images by supporter players, in bytes. */
    supporterMaxImageSize: number;
    /** The maximum number of characters supporter players can own. */
    supporterMaxOwnedChars: number;
    /** The maximum number of room profiles supporter players can have. */
    supporterMaxRoomProfiles: number;
    /** The maximum number of room scripts supporter players can have. */
    supporterMaxRoomScripts: number;
    /** The realm name. */
    title: string;
    /** The VAPID public key used for push notifications via Web Push protocol. */
    vapidPublicKey: string;
    /** The current version of the realm. */
    version: string;
}

/** The tag info. */
export interface TagInfoProperties {
    /** The maximum number of tags a character can have. */
    charTagsLimit: number;
    /** The maximum length of a tag group's key. */
    groupKeyMaxLength: number;
    /** The maximum length of a tag group's name. */
    groupNameMaxLength: number;
    /** The maximum length of a tag's description. */
    tagDescMaxLength: number;
    /** The maximum length of a tag's key. */
    tagKeyMaxLength: number;
}

/** The mail info. */
export interface MailInfoProperties {
    /** The maximum length of a mail. */
    mailMaxLength: number;
}

/** The note info. */
export interface NoteInfoProperties {
    /** The maximum length of a note. */
    noteMaxLength: number;
}

/** The report info. */
export interface ReportInfoProperties {
    /** The maximum length of a report. */
    reportMsgMaxLength: number;
}

/** The support info. */
export interface SupportInfoProperties {
    /** The maximum length of a ticket. */
    ticketMsgMaxLength: number;
}

/** The web client info. */
export interface WebClientInfoProperties {
    /** The version of the web client. */
    version: string;
}

/** A notice. @TODO Have not been able to inspect a notice, so the rid and full properties are not known */
export interface NoticeProperties {
    /** The ID of the notice. */
    id: string;
    /** The type of the notice. */
    type: string;
}

/** A mail user, seen in a {@link PlayerMailMessage}. */
export interface MailUserProperties {
    /** The avatar of the user. */
    avatar: string;
    /** The ID of the user. */
    id: string;
    /** The name of the user. */
    name: string;
    /** The surname of the user. */
    surname: string;
    /** The type of the user. */
    type: MailCharacterType;
}

/** A management token. */
export interface TokenProperties {
    /** The creation timestamp of the token. */
    created: number;
    /** The unique identifier of the token. */
    id: string;
    /** The issuance timestamp of the token. */
    issued: number;
    /** The secret key associated with the token. */
    secret: string;
}

/** The authenticated user's management tokens. */
export interface TokensProperties {}
