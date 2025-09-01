/* =module */
/* eslint-disable unused-imports/no-unused-imports, @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/member-ordering, key-spacing, import/order, @typescript-eslint/no-unused-vars */
import {
    modelProperty,
    collectionProperty,
    refProperty,
    ResError,
    ResRef,
    type PropertyDefinition
} from "resclient-ts";
import RoomCharactersAwake from "../../collections/RoomCharactersAwake.js";
import AreaChildren from "../../models/AreaChildren.js";
import Image from "../../models/Image.js";
import Character from "../../models/Character.js";
import AreaDetails from "../../models/AreaDetails.js";
import OwnedCharacter from "../../models/OwnedCharacter.js";
import ControlledCharacter from "../../models/ControlledCharacter.js";
import CharacterTags from "../../models/CharacterTags.js";
import Room from "../../models/Room.js";
import RoomDetails from "../../models/RoomDetails.js";
import LookedAt from "../../models/LookedAt.js";
import LookAt from "../../models/LookAt.js";
import CharacterNodes from "../../collections/CharacterNodes.js";
import OwnedAreas from "../../collections/OwnedAreas.js";
import OwnedRooms from "../../collections/OwnedRooms.js";
import Profiles from "../../collections/Profiles.js";
import PuppetInfo from "../../models/PuppetInfo.js";
import Settings from "../../models/Settings.js";
import AfarRoom from "../../models/AfarRoom.js";
import CharacterDetails from "../../models/CharacterDetails.js";
import OwnedCharacters from "../../collections/OwnedCharacters.js";
import ControlledCharacters from "../../collections/ControlledCharacters.js";
import MutedCharacters from "../../models/MutedCharacters.js";
import Puppets from "../../collections/Puppets.js";
import MailMessage from "../../models/MailMessage.js";
import RequestParams from "../../models/RequestParams.js";
import Area from "../../models/Area.js";
import RoomCharacters from "../../collections/RoomCharacters.js";
import RoomCommands from "../../models/RoomCommands.js";
import Exits from "../../collections/Exits.js";
import ScriptBinary from "../../models/ScriptBinary.js";
import ScriptLogs from "../../collections/ScriptLogs.js";
import Focus from "../../models/Focus.js";
import Triggers from "../../collections/Triggers.js";
import Identity from "../../models/Identity.js";

export const AfarRoomDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    name: { type: "string" },
    awake: collectionProperty("awake", RoomCharactersAwake, true, false)
};

export const AreaDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    name: { type: "string" }
};

export const AreaChildDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    mapX: { type: "number" },
    mapY: { type: "number" },
    name: { type: "string" },
    pop: { type: "number" },
    shortDesc: { type: "string" },
    type: { type: "string" }
};

export const AreaChildrenDefinition: Record<string, PropertyDefinition> = {};

export const AreaDetailsDefinition: Record<string, PropertyDefinition> = {
    about: { type: "string" },
    children: modelProperty("children", AreaChildren, false, false),
    id: { type: "string" },
    image: modelProperty("image", Image, true, false),
    mapX: { type: "number" },
    mapY: { type: "number" },
    name: { type: "string" },
    owner: modelProperty("owner", Character, false, false),
    parent: modelProperty("parent", AreaDetails, true, false),
    pop: { type: "number" },
    private: { type: "boolean" },
    prv: { type: "number" },
    rules: { type: "string" },
    shortDesc: { type: "string" }
};

export const AwakeCharactersDefinition: Record<string, PropertyDefinition> = {};

export const BotUserDefinition: Record<string, PropertyDefinition> = {
    char: modelProperty("char", OwnedCharacter, false, false),
    controlled: modelProperty("controlled", ControlledCharacter, true, false)
};

export const CharacterDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    awake: { type: "boolean" },
    controller: { type: "?string" },
    deleted: { type: "?number" },
    gender: { type: "string" },
    id: { type: "string" },
    idle: { type: "number" },
    lastAwake: { type: "?number" },
    name: { type: "string" },
    puppeteer: modelProperty("puppeteer", Character, true, false),
    rp: { type: "string" },
    species: { type: "string" },
    state: { type: "string" },
    status: { type: "string" },
    surname: { type: "string" },
    tags: modelProperty("tags", CharacterTags, false, false),
    type: { type: "string" }
};

export const CharacterDetailsDefinition: Record<string, PropertyDefinition> = {
    about: { type: "string" },
    avatar: { type: "string" },
    desc: { type: "string" },
    gender: { type: "string" },
    id: { type: "string" },
    idle: { type: "number" },
    name: { type: "string" },
    species: { type: "string" },
    state: { type: "string" },
    status: { type: "string" },
    surname: { type: "string" },
    tags: modelProperty("tags", CharacterTags, false, false),
    image: modelProperty("image", Image, true, false),
    type: { type: "string" }
};

export const CharacterInfoDefinition: Record<string, PropertyDefinition> = {
    about: { type: "string" },
    lfrpDesc: { type: "string" }
};

export const CharacterMinDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    gender: { type: "string" },
    id: { type: "string" },
    name: { type: "string" },
    species: { type: "string" },
    surname: { type: "string" }
};

export const ControlledCharacterDefinition: Record<string, PropertyDefinition> = {
    about: { type: "string" },
    avatar: { type: "string" },
    ctrlSince: { type: "number" },
    controller: { type: "?string" },
    customTeleportMsgs: { type: "boolean" },
    desc: { type: "string" },
    gender: { type: "string" },
    home: modelProperty("home", Room, false, false),
    id: { type: "string" },
    idle: { type: "number" },
    image: modelProperty("image", Image, true, false),
    inRoom: modelProperty("inRoom", RoomDetails, false, false),
    lfrpDesc: { type: "?string" },
    lookedAt: modelProperty("lookedAt", LookedAt, false, false),
    lookingAt: modelProperty("lookingAt", LookAt, true, false),
    name: { type: "string" },
    nodes: collectionProperty("nodes", CharacterNodes, false, false),
    ownedAreas: collectionProperty("ownedAreas", OwnedAreas, false, false),
    ownedRooms: collectionProperty("ownedRooms", OwnedRooms, false, false),
    profiles: collectionProperty("profiles", Profiles, false, false),
    puppeteer: modelProperty("puppeteer", Character, true, false),
    puppetInfo: modelProperty("puppetInfo", PuppetInfo, true, false),
    rp: { type: "string" },
    settings: modelProperty("settings", Settings, false, false),
    species: { type: "string" },
    state: { type: "string" },
    status: { type: "string" },
    surname: { type: "string" },
    tags: modelProperty("tags", CharacterTags, false, false),
    teleportArriveMsg: { type: "string" },
    teleportLeaveMsg: { type: "string" },
    teleportTravelMsg: { type: "string" },
    type: { type: "string" }
};

export const ExitDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    keys: { type: "array[string]" },
    icon: { type: "string" },
    nav: { type: "string" },
    name: { type: "string" },
    target: modelProperty("target", AfarRoom, true, false),
    targetId: { type: "string" }
};

export const ExitDetailsDefinition: Record<string, PropertyDefinition> = {
    arriveMsg: { type: "string" },
    created: { type: "number" },
    hidden: { type: "boolean" },
    icon: { type: "string" },
    id: { type: "string" },
    inactive: { type: "boolean" },
    keys: { type: "array[string]" },
    leaveMsg: { type: "string" },
    name: { type: "string" },
    nav: { type: "string" },
    targetRoom: modelProperty("targetRoom", Room, false, false),
    transparent: { type: "boolean" },
    travelMsg: { type: "string" }
};

export const FocusDefinition: Record<string, PropertyDefinition> = {};

export const FocusCharsDefinition: Record<string, PropertyDefinition> = {};

export const IdentityDefinition: Record<string, PropertyDefinition> = {
    allowNewsletter: { type: "boolean" },
    created: { type: "number" },
    email: { type: "?string" },
    emailVerified: { type: "boolean" },
    hasLogin: { type: "boolean" },
    hasOpenId: { type: "boolean" },
    id: { type: "string" },
    idRoles: { type: "array[string]" },
    name: { type: "string" },
    openIdProvider: { type: "?string" },
    username: { type: "string" }
};

export const ImageDefinition: Record<string, PropertyDefinition> = {
    filename: { type: "string" },
    height: { type: "number" },
    href: { type: "string" },
    mime: { type: "string" },
    sha256: { type: "string" },
    size: { type: "number" },
    width: { type: "number" }
};

export const LookAtDefinition: Record<string, PropertyDefinition> = {
    charId: { type: "string" },
    char: modelProperty("char", CharacterDetails, true, false),
    unseen: modelProperty("unseen", Character, true, false)
};

export const LookedAtDefinition: Record<string, PropertyDefinition> = {};

export const MailMessageDefinition: Record<string, PropertyDefinition> = {
    ooc: { type: "boolean" },
    pose: { type: "boolean" },
    text: { type: "string" }
};

export const MutedCharactersDefinition: Record<string, PropertyDefinition> = {};

export const NodeDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    key: { type: "string" },
    room: modelProperty("room", Room, false, false)
};

export const NoteDefinition: Record<string, PropertyDefinition> = {
    char: refProperty("char", false, false), // Character
    text: { type: "string" }
};

export const NotesDefinition: Record<string, PropertyDefinition> = {};

export const OwnedCharacterDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    controller: { type: "?string" },
    created: { type: "number" },
    desc: { type: "string" },
    gender: { type: "string" },
    id: { type: "string" },
    idle: { type: "number" },
    image: modelProperty("image", Image, true, false),
    inRoom: modelProperty("inRoom", Room, false, false),
    lastAwake: { type: "?number" },
    name: { type: "string" },
    settings: modelProperty("settings", Settings, false, false),
    species: { type: "string" },
    state: { type: "string" },
    status: { type: "string" },
    surname: { type: "string" },
    type: { type: "string" }
};

export const PlayerDefinition: Record<string, PropertyDefinition> = {
    chars: collectionProperty("chars", OwnedCharacters, false, false),
    controlled: collectionProperty("controlled", ControlledCharacters, false, false),
    id: { type: "string" },
    mutedChars: modelProperty("mutedChars", MutedCharacters, false, false),
    notifyOnEvent: { type: "boolean" },
    notifyOnMatched: { type: "boolean" },
    notifyOnMention: { type: "boolean" },
    notifyOnRequests: { type: "boolean" },
    notifyOnWakeup: { type: "boolean" },
    notifyOnWatched: { type: "boolean" },
    puppets: collectionProperty("puppets", Puppets, false, false)
};

export const PlayerMailMessageDefinition: Record<string, PropertyDefinition> = {
    from: { type: "object" },
    message: modelProperty("message", MailMessage, false, false),
    read: { type: "?number" },
    received: { type: "number" },
    to: { type: "object" }
};

export const ProfileDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    gender: { type: "string" },
    id: { type: "string" },
    image: { type: "string" },
    key: { type: "string" },
    lastUsed: { type: "number" },
    name: { type: "string" },
    species: { type: "string" }
};

export const PuppetDefinition: Record<string, PropertyDefinition> = {
    lastUsed: { type: "number" },
    registered: { type: "number" },
    char: modelProperty("char", OwnedCharacter, false, false),
    puppet: modelProperty("puppet", Character, false, false),
    settings: modelProperty("settings", Settings, false, false)
};

export const PuppetInfoDefinition: Record<string, PropertyDefinition> = {
    boundingArea: { type: "any" },
    howToPlay: { type: "string" }
};

export const RequestDefinition: Record<string, PropertyDefinition> = {
    answered: { type: "?number" },
    created: { type: "number" },
    error: { type: "?object" },
    expires: { type: "number" },
    from: modelProperty("from", Character, false, false),
    id: { type: "string" },
    params: modelProperty("params", RequestParams, false, false),
    state: { type: "string" },
    to: modelProperty("to", Character, false, false),
    type: { type: "string" }
};

export const RequestParamsDefinition: Record<string, PropertyDefinition> = {
    area: modelProperty("area", Area, true, true),
    owner: modelProperty("owner", Character, false, false),
    room: modelProperty("room", Room, true, true)
};

export const RoomDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    name: { type: "string" }
};

export const RoomCharacterDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    controller: { type: "?string" },
    gender: { type: "string" },
    id: { type: "string" },
    idle: { type: "number" },
    name: { type: "string" },
    puppeteer: modelProperty("puppeteer", Character, true, false),
    rp: { type: "string" },
    species: { type: "string" },
    state: { type: "string" },
    status: { type: "string" },
    surname: { type: "string" },
    type: { type: "string" }
};

export const RoomChildDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    mapX: { type: "number" },
    mapY: { type: "number" },
    name: { type: "string" },
    pop: { type: "number" },
    type: { type: "string" }
};

export const RoomCommandDefinition: Record<string, PropertyDefinition> = {
    cmd: { type: "object" },
    id: { type: "string" },
    priority: { type: "number" }
};

export const RoomCommandsDefinition: Record<string, PropertyDefinition> = {};

export const RoomDetailsDefinition: Record<string, PropertyDefinition> = {
    area: modelProperty("area", AreaDetails, true, false),
    autosweep: { type: "boolean" },
    autosweepDelay: { type: "number" },
    chars: collectionProperty("chars", RoomCharacters, true, false),
    cmds: modelProperty("cmds", RoomCommands, false, false),
    desc: { type: "string" },
    exits: collectionProperty("exits", Exits, false, false),
    id: { type: "string" },
    image: modelProperty("image", Image, true, false),
    isDark: { type: "boolean" },
    isHome: { type: "boolean" },
    isInstance: { type: "boolean" },
    isQuiet: { type: "boolean" },
    isTeleport: { type: "boolean" },
    listen: { type: "boolean" },
    mapX: { type: "number" },
    mapY: { type: "number" },
    name: { type: "string" },
    owner: modelProperty("owner", Character, false, false),
    pop: { type: "number" },
    private: { type: "boolean" }
};

export const RoomInstanceDetailsDefinition: Record<string, PropertyDefinition> = {
    area: modelProperty("area", AreaDetails, true, false),
    autosweep: { type: "boolean" },
    autosweepDelay: { type: "number" },
    chars: collectionProperty("chars", RoomCharacters, true, false),
    cmds: modelProperty("cmds", RoomCommands, false, false),
    desc: { type: "string" },
    exits: collectionProperty("exits", Exits, false, false),
    id: { type: "string" },
    image: modelProperty("image", Image, true, false),
    instance: { type: "string" },
    isDark: { type: "boolean" },
    isHome: { type: "boolean" },
    isInstance: { type: "boolean" },
    isQuiet: { type: "boolean" },
    isTeleport: { type: "boolean" },
    listen: { type: "boolean" },
    mapX: { type: "number" },
    mapY: { type: "number" },
    name: { type: "string" },
    owner: modelProperty("owner", Character, false, false),
    pop: { type: "number" },
    private: { type: "boolean" }
};

export const RoomProfileDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    image: { type: "string" },
    key: { type: "string" },
    lastUsed: { type: "number" },
    name: { type: "string" }
};

export const RoomScriptDefinition: Record<string, PropertyDefinition> = {
    active: { type: "boolean" },
    created: { type: "number" },
    id: { type: "string" },
    key: { type: "string" },
    updated: { type: "number" },
    version: { type: "string" }
};

export const RoomScriptDetailsDefinition: Record<string, PropertyDefinition> = {
    active: { type: "boolean" },
    address: { type: "string" },
    binary: modelProperty("binary", ScriptBinary, true, false),
    created: { type: "number" },
    id: { type: "string" },
    key: { type: "string" },
    logs: collectionProperty("logs", ScriptLogs, false, false),
    room: modelProperty("room", Room, false, false),
    target: { type: "string" },
    updated: { type: "number" },
    version: { type: "string" }
};

export const TokenUserDefinition: Record<string, PropertyDefinition> = {
    created: { type: "number" },
    id: { type: "string" },
    roles: { type: "any" },
    trust: { type: "string" }
};

export const ScriptBinaryDefinition: Record<string, PropertyDefinition> = {
    filename: { type: "string" },
    href: { type: "string" },
    mime: { type: "string" },
    sha256: { type: "string" },
    size: { type: "number" }
};

export const ScriptLogDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    lvl: { type: "string" },
    msg: { type: "string" },
    time: { type: "number" }
};

export const SettingsDefinition: Record<string, PropertyDefinition> = {
    dnd: { type: "boolean" },
    dndMsg: { type: "string" },
    focus: modelProperty("focus", Focus, false, false),
    muteMessage: { type: "boolean" },
    muteOoc: { type: "boolean" },
    muteTravel: { type: "boolean" },
    notifyOnAll: { type: "boolean" },
    lfrpDesc: { type: "string" },
    triggers: collectionProperty("triggers", Triggers, false, false)
};

export const TagDefinition: Record<string, PropertyDefinition> = {
    custom: { type: "boolean" },
    desc: { type: "string" },
    group: { type: "?string" },
    id: { type: "string" },
    idRole: { type: "?string" },
    key: { type: "string" },
    role: { type: "?string" }
};

export const CharacterTagsDefinition: Record<string, PropertyDefinition> = {};

export const UnreadMailDefinition: Record<string, PropertyDefinition> = {};

export const UserDefinition: Record<string, PropertyDefinition> = {
    created: { type: "number" },
    id: { type: "string" },
    roles: { type: "any" },
    trust: { type: "string" },
    identity: modelProperty("identity", Identity, false, false)
};

export const WatchDefinition: Record<string, PropertyDefinition> = {
    char: modelProperty("char", Character, false, false),
    created: { type: "number" },
    watchers: { type: "array[string]" }
};

export const WatchesDefinition: Record<string, PropertyDefinition> = {};

export const TagsDefinition: Record<string, PropertyDefinition> = {};

export const TagGroupDefinition: Record<string, PropertyDefinition> = {
    key: { type: "string" },
    name: { type: "string" },
    order: { type: "number" }
};

export const TagGroupsDefinition: Record<string, PropertyDefinition> = {};

export const CoreInfoDefinition: Record<string, PropertyDefinition> = {
    about: { type: "string" },
    adminMaxCharProfiles: { type: "number" },
    adminMaxOwnedChars: { type: "number" },
    adminMaxRoomProfiles: { type: "number" },
    adminMaxRoomScripts: { type: "number" },
    builderMaxOwnedAreas: { type: "number" },
    builderMaxOwnedRooms: { type: "number" },
    communicationMaxLength: { type: "number" },
    descriptionMaxLength: { type: "number" },
    genre: { type: "string" },
    greeting: { type: "string" },
    itemNameMaxLength: { type: "number" },
    keyMaxLength: { type: "number" },
    maxCharProfiles: { type: "number" },
    maxFollows: { type: "number" },
    maxImageSize: { type: "number" },
    maxListItems: { type: "number" },
    maxOwnedAreas: { type: "number" },
    maxOwnedChars: { type: "number" },
    maxOwnedRooms: { type: "number" },
    maxRoomExits: { type: "number" },
    maxRoomProfiles: { type: "number" },
    maxRoomScripts: { type: "number" },
    maxScheduledPosts: { type: "number" },
    propertyMaxLength: { type: "number" },
    rules: { type: "string" },
    scriptMaxLength: { type: "number" },
    shortDescriptionMaxLength: { type: "number" },
    subgenre: { type: "string" },
    supporterMaxCharProfiles: { type: "number" },
    supporterMaxImageSize: { type: "number" },
    supporterMaxOwnedChars: { type: "number" },
    supporterMaxRoomProfiles: { type: "number" },
    supporterMaxRoomScripts: { type: "number" },
    title: { type: "string" },
    vapidPublicKey: { type: "string" },
    version: { type: "string" }
};

export const TagInfoDefinition: Record<string, PropertyDefinition> = {
    charTagsLimit: { type: "number" },
    groupKeyMaxLength: { type: "number" },
    groupNameMaxLength: { type: "number" },
    tagDescMaxLength: { type: "number" },
    tagKeyMaxLength: { type: "number" }
};

export const MailInfoDefinition: Record<string, PropertyDefinition> = {
    mailMaxLength: { type: "number" }
};

export const NoteInfoDefinition: Record<string, PropertyDefinition> = {
    noteMaxLength: { type: "number" }
};

export const ReportInfoDefinition: Record<string, PropertyDefinition> = {
    reportMsgMaxLength: { type: "number" }
};

export const SupportInfoDefinition: Record<string, PropertyDefinition> = {
    ticketMsgMaxLength: { type: "number" }
};

export const WebClientInfoDefinition: Record<string, PropertyDefinition> = {
    version: { type: "string" }
};

export const NoticeDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    type: { type: "string" }
};

export const MailUserDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    id: { type: "string" },
    name: { type: "string" },
    surname: { type: "string" },
    type: { type: "string" }
};

export const TokenDefinition: Record<string, PropertyDefinition> = {
    created: { type: "number" },
    id: { type: "string" },
    issued: { type: "number" },
    secret: { type: "string" }
};

export const BotDefinition: Record<string, PropertyDefinition> = {
    char: modelProperty("char", Character, false, false),
    created: { type: "number" },
    issued: { type: "number" },
    token: { type: "string" }
};

export const BotsDefinition: Record<string, PropertyDefinition> = {};

export const HiddenExitsDefinition: Record<string, PropertyDefinition> = {};
