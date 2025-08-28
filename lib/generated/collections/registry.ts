/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports, import/order */
import ResourceIDs from "../ResourceIDs.js";
import type WolferyJS from "../../WolferyJS.js";
import type { ResClient } from "resclient-ts";

import CharacterNodes from "../../collections/CharacterNodes.js";
import ControlledCharacters from "../../collections/ControlledCharacters.js";
import Exits from "../../collections/Exits.js";
import GlobalTeleports from "../../collections/GlobalTeleports.js";
import Inbox from "../../collections/Inbox.js";
import IncomingRequests from "../../collections/IncomingRequests.js";
import OutgoingRequests from "../../collections/OutgoingRequests.js";
import OwnedAreas from "../../collections/OwnedAreas.js";
import OwnedCharacters from "../../collections/OwnedCharacters.js";
import OwnedRooms from "../../collections/OwnedRooms.js";
import Profiles from "../../collections/Profiles.js";
import Puppets from "../../collections/Puppets.js";
import RoomCharacters from "../../collections/RoomCharacters.js";
import RoomCharactersAwake from "../../collections/RoomCharactersAwake.js";
import RoomProfiles from "../../collections/RoomProfiles.js";
import RoomScripts from "../../collections/RoomScripts.js";
import ScriptLogs from "../../collections/ScriptLogs.js";
import Triggers from "../../collections/Triggers.js";
import AuthNotices from "../../collections/AuthNotices.js";
import IdentityNotices from "../../collections/IdentityNotices.js";
import Tokens from "../../collections/Tokens.js";
import Tenants from "../../collections/Tenants.js";
import Teleporters from "../../collections/Teleporters.js";

export default function registerCollections(client: WolferyJS, res: ResClient): void {
    res.registerCollectionType(ResourceIDs.CHARACTER_NODES({ id: "*" }), (api, rid) => new CharacterNodes(client, api, rid));
    res.registerCollectionType(ResourceIDs.CONTROLLED_CHARACTERS({ id: "*" }), (api, rid) => new ControlledCharacters(client, api, rid));
    res.registerCollectionType(ResourceIDs.EXITS({ id: "*" }), (api, rid) => new Exits(client, api, rid));
    res.registerCollectionType(ResourceIDs.NODES, (api, rid) => new GlobalTeleports(client, api, rid));
    res.registerCollectionType(ResourceIDs.INBOX({ id: "*" }), (api, rid) => new Inbox(client, api, rid));
    res.registerCollectionType(ResourceIDs.INCOMING_REQUESTS({ id: "*" }), (api, rid) => new IncomingRequests(client, api, rid));
    res.registerCollectionType(ResourceIDs.OUTGOING_REQUESTS({ id: "*" }), (api, rid) => new OutgoingRequests(client, api, rid));
    res.registerCollectionType(ResourceIDs.OWNED_AREAS({ id: "*" }), (api, rid) => new OwnedAreas(client, api, rid));
    res.registerCollectionType(ResourceIDs.OWNED_CHARACTERS({ id: "*" }), (api, rid) => new OwnedCharacters(client, api, rid));
    res.registerCollectionType(ResourceIDs.OWNED_ROOMS({ id: "*" }), (api, rid) => new OwnedRooms(client, api, rid));
    res.registerCollectionType(ResourceIDs.PROFILES({ id: "*" }), (api, rid) => new Profiles(client, api, rid));
    res.registerCollectionType(ResourceIDs.PUPPETS({ id: "*" }), (api, rid) => new Puppets(client, api, rid));
    res.registerCollectionType(ResourceIDs.ROOM_CHARACTERS({ id: "*" }), (api, rid) => new RoomCharacters(client, api, rid));
    res.registerCollectionType(ResourceIDs.ROOM_INSTANCE_CHARACTERS({ instance: "*", room: "*" }), (api, rid) => new RoomCharacters(client, api, rid));
    res.registerCollectionType(ResourceIDs.ROOM_CHARACTERS_AWAKE({ id: "*" }), (api, rid) => new RoomCharactersAwake(client, api, rid));
    res.registerCollectionType(ResourceIDs.ROOM_INSTANCE_CHARACTERS_AWAKE({ instance: "*", room: "*" }), (api, rid) => new RoomCharactersAwake(client, api, rid));
    res.registerCollectionType(ResourceIDs.ROOM_PROFILES({ id: "*" }), (api, rid) => new RoomProfiles(client, api, rid));
    res.registerCollectionType(ResourceIDs.ROOM_SCRIPTS({ id: "*" }), (api, rid) => new RoomScripts(client, api, rid));
    res.registerCollectionType(ResourceIDs.SCRIPT_LOGS({ id: "*" }), (api, rid) => new ScriptLogs(client, api, rid));
    res.registerCollectionType(ResourceIDs.CHARACTER_SETTINGS_TRIGGERS({ id: "*" }), (api, rid) => new Triggers(client, api, rid));
    res.registerCollectionType(ResourceIDs.PUPPET_SETTINGS_TRIGGERS({ ctrl: "*", puppet: "*" }), (api, rid) => new Triggers(client, api, rid));
    res.registerCollectionType(ResourceIDs.AUTH_NOTICES({ id: "*" }), (api, rid) => new AuthNotices(client, api, rid));
    res.registerCollectionType(ResourceIDs.IDENTITY_NOTICES({ id: "*" }), (api, rid) => new IdentityNotices(client, api, rid));
    res.registerCollectionType(ResourceIDs.TOKENS({ id: "*" }), (api, rid) => new Tokens(client, api, rid));
    res.registerCollectionType(ResourceIDs.TENANTS({ id: "*" }), (api, rid) => new Tenants(client, api, rid));
    res.registerCollectionType(ResourceIDs.TELEPORTERS({ id: "*" }), (api, rid) => new Teleporters(client, api, rid));
}
