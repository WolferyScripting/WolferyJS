/* eslint-disable unused-imports/no-unused-imports, @typescript-eslint/no-empty-interface, @typescript-eslint/no-explicit-any, @typescript-eslint/member-ordering, key-spacing, import/order, @typescript-eslint/no-unused-vars */
import { modelProperty, collectionProperty, type PropertyDefinition } from "resclient-ts";
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
    awake: collectionProperty("awake", RoomCharactersAwake, false)
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
    children: modelProperty("children", AreaChildren, false),
    id: { type: "string" },
    image: modelProperty("image", Image, true),
    mapX: { type: "number" },
    mapY: { type: "number" },
    name: { type: "string" },
    owner: modelProperty("owner", Character, false),
    parent: modelProperty("parent", AreaDetails, true),
    pop: { type: "number" },
    private: { type: "boolean" },
    prv: { type: "number" },
    rules: { type: "string" },
    shortDesc: { type: "string" }
};

export const AwakeCharactersDefinition: Record<string, PropertyDefinition> = {};

export const BotDefinition: Record<string, PropertyDefinition> = {
    char: modelProperty("char", OwnedCharacter, false),
    controlled: modelProperty("controlled", ControlledCharacter, true)
};

export const CharacterDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    awake: { type: "boolean" },
    deleted: { type: "?number" },
    gender: { type: "string" },
    id: { type: "string" },
    idle: { type: "number" },
    lastAwake: { type: "number" },
    name: { type: "string" },
    puppeteer: modelProperty("puppeteer", Character, true),
    rp: { type: "string" },
    species: { type: "string" },
    state: { type: "string" },
    status: { type: "string" },
    surname: { type: "string" },
    tags: modelProperty("tags", CharacterTags, false),
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
    tags: modelProperty("tags", CharacterTags, false),
    image: modelProperty("image", Image, true),
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
    customTeleportMsgs: { type: "boolean" },
    desc: { type: "string" },
    gender: { type: "string" },
    home: modelProperty("home", Room, false),
    id: { type: "string" },
    idle: { type: "number" },
    image: modelProperty("image", Image, true),
    inRoom: modelProperty("inRoom", RoomDetails, false),
    lfrpDesc: { type: "?string" },
    lookedAt: modelProperty("lookedAt", LookedAt, false),
    lookingAt: modelProperty("lookingAt", LookAt, true),
    name: { type: "string" },
    nodes: collectionProperty("nodes", CharacterNodes, false),
    ownedAreas: collectionProperty("ownedAreas", OwnedAreas, false),
    ownedRooms: collectionProperty("ownedRooms", OwnedRooms, false),
    profiles: collectionProperty("profiles", Profiles, false),
    puppeteer: modelProperty("puppeteer", Character, true),
    puppetInfo: modelProperty("puppetInfo", PuppetInfo, true),
    rp: { type: "string" },
    settings: modelProperty("settings", Settings, false),
    species: { type: "string" },
    state: { type: "string" },
    status: { type: "string" },
    surname: { type: "string" },
    tags: modelProperty("tags", CharacterTags, false),
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
    target: modelProperty("target", AfarRoom, false),
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
    targetRoom: modelProperty("targetRoom", Room, false),
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
    char: modelProperty("char", CharacterDetails, true),
    unseen: modelProperty("unseen", Character, true)
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
    room: modelProperty("room", Room, false)
};

export const NoteDefinition: Record<string, PropertyDefinition> = {
    char: modelProperty("char", Character, false),
    text: { type: "string" }
};

export const NotesDefinition: Record<string, PropertyDefinition> = {};

export const OwnedCharacterDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    created: { type: "number" },
    desc: { type: "string" },
    gender: { type: "string" },
    id: { type: "string" },
    idle: { type: "number" },
    image: modelProperty("image", Image, true),
    inRoom: modelProperty("inRoom", Room, false),
    lastAwake: { type: "number" },
    name: { type: "string" },
    settings: modelProperty("settings", Settings, false),
    species: { type: "string" },
    state: { type: "string" },
    status: { type: "string" },
    surname: { type: "string" },
    type: { type: "string" }
};

export const PlayerDefinition: Record<string, PropertyDefinition> = {
    chars: collectionProperty("chars", OwnedCharacters, false),
    controlled: collectionProperty("controlled", ControlledCharacters, false),
    id: { type: "string" },
    mutedChars: modelProperty("mutedChars", MutedCharacters, false),
    notifyOnEvent: { type: "boolean" },
    notifyOnMatched: { type: "boolean" },
    notifyOnMention: { type: "boolean" },
    notifyOnRequests: { type: "boolean" },
    notifyOnWakeup: { type: "boolean" },
    notifyOnWatched: { type: "boolean" },
    puppets: collectionProperty("puppets", Puppets, false)
};

export const PlayerMailMessageDefinition: Record<string, PropertyDefinition> = {
    from: { type: "object" },
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
    char: modelProperty("char", OwnedCharacter, false),
    puppet: modelProperty("puppet", Character, false),
    settings: modelProperty("settings", Settings, false)
};

export const PuppetInfoDefinition: Record<string, PropertyDefinition> = {
    boundingArea: { type: "any" },
    howToPlay: { type: "string" }
};

export const RequestDefinition: Record<string, PropertyDefinition> = {
    answered: { type: "number" },
    created: { type: "number" },
    error: { type: "any" },
    expires: { type: "number" },
    from: modelProperty("from", Character, false),
    id: { type: "string" },
    params: modelProperty("params", RequestParams, false),
    state: { type: "string" },
    to: modelProperty("to", Character, false),
    type: { type: "string" }
};

export const RequestParamsDefinition: Record<string, PropertyDefinition> = {
    area: modelProperty("area", Area, true),
    room: modelProperty("room", Room, true)
};

export const RoomDefinition: Record<string, PropertyDefinition> = {
    id: { type: "string" },
    name: { type: "string" }
};

export const RoomCharacterDefinition: Record<string, PropertyDefinition> = {
    avatar: { type: "string" },
    gender: { type: "string" },
    id: { type: "string" },
    idle: { type: "number" },
    name: { type: "string" },
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
    area: modelProperty("area", AreaDetails, true),
    autosweep: { type: "boolean" },
    autosweepDelay: { type: "number" },
    chars: collectionProperty("chars", RoomCharacters, false),
    cmds: modelProperty("cmds", RoomCommands, false),
    desc: { type: "string" },
    exits: collectionProperty("exits", Exits, false),
    id: { type: "string" },
    image: modelProperty("image", Image, true),
    isDark: { type: "boolean" },
    isHome: { type: "boolean" },
    isInstance: { type: "boolean" },
    isQuiet: { type: "boolean" },
    isTeleport: { type: "boolean" },
    listen: { type: "boolean" },
    mapX: { type: "number" },
    mapY: { type: "number" },
    name: { type: "string" },
    owner: modelProperty("owner", Character, false),
    pop: { type: "number" },
    private: { type: "boolean" }
};

export const RoomInstanceDetailsDefinition: Record<string, PropertyDefinition> = {
    area: modelProperty("area", AreaDetails, true),
    autosweep: { type: "boolean" },
    autosweepDelay: { type: "number" },
    chars: collectionProperty("chars", RoomCharacters, false),
    cmds: modelProperty("cmds", RoomCommands, false),
    desc: { type: "string" },
    exits: collectionProperty("exits", Exits, false),
    id: { type: "string" },
    image: modelProperty("image", Image, true),
    instanceId: { type: "string" },
    isDark: { type: "boolean" },
    isHome: { type: "boolean" },
    isInstance: { type: "boolean" },
    isQuiet: { type: "boolean" },
    isTeleport: { type: "boolean" },
    listen: { type: "boolean" },
    mapX: { type: "number" },
    mapY: { type: "number" },
    name: { type: "string" },
    owner: modelProperty("owner", Character, false),
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
    binary: modelProperty("binary", ScriptBinary, true),
    created: { type: "number" },
    id: { type: "string" },
    key: { type: "string" },
    logs: collectionProperty("logs", ScriptLogs, false),
    room: modelProperty("room", Room, false),
    target: { type: "string" },
    updated: { type: "number" },
    version: { type: "string" }
};

export const SafeUserDefinition: Record<string, PropertyDefinition> = {
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
    focus: modelProperty("focus", Focus, false),
    muteMessage: { type: "boolean" },
    muteOoc: { type: "boolean" },
    muteTravel: { type: "boolean" },
    notifyOnAll: { type: "boolean" },
    lfrpDesc: { type: "string" },
    triggers: collectionProperty("triggers", Triggers, false)
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
    identity: modelProperty("identity", Identity, false)
};

export const WatchDefinition: Record<string, PropertyDefinition> = {
    char: modelProperty("char", Character, false),
    created: { type: "number" },
    watchers: { type: "array[string]" }
};

export const WatchesDefinition: Record<string, PropertyDefinition> = {};
