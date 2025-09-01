import type { AuthTypes, BotAuthentication, PasswordAuthentication, TokenAuthentication } from "./util/types.js";
import TypedEmitter from "./util/TypedEmitter.js";
import User from "./models/User.js";
import BotUser from "./models/BotUser.js";
import type Player from "./models/Player.js";
import { ErrorCodes, PublicPepper } from "./util/Constants.js";
import TokenUser from "./models/TokenUser.js";
import { waitForCached, waitForEvent, type WaitForEventOptions, type WaitForCachedOptions } from "./util/Util.js";
import type OwnedCharacter from "./models/OwnedCharacter.js";
import ControlledCharacter from "./models/ControlledCharacter.js";
import ResourceIDs from "./generated/ResourceIDs.js";
import registerCollections from "./generated/collections/registry.js";
import registerModels from "./generated/models/registry.js";
import type { Events } from "./util/events.js";
import type Notes from "./models/Notes.js";
import Commands from "./commands/Commands.js";
import { enableCustomInspectForCollections } from "./collections/BaseCollection.js";
import { enableCustomInspectForCollectionModels } from "./models/BaseCollectionModel.js";
import { enableCustomInspectForModels } from "./models/BaseModel.js";
import type Character from "./models/Character.js";
import {
    type ClientOptions,
    ResError,
    ResModel,
    type AnyRes,
    type AnyObject,
    ResClient,
    ResCollection,
    type ResourceType,
    type ItemFactory,
    Properties
} from "resclient-ts";
import { WebSocket } from "ws";
import { createHash, createHmac } from "node:crypto";
import assert from "node:assert";

export interface Options {
    /** The base domain the api you're connecting to is on. `wolfery.com`/`test.mucklet.com` will probably be the only values you want. Do not append `api.` or http(s). */
    apiDomain?: string;
    /**
     * The authentication to use. Either username/password, a bot token, or a management token.
     */
    authentication: {
        /** The key to use for HMAC. Defaults to `TheStoryStartsHere`. */
        HMACKey?: string;
        /** The password of the account you're logging in with. */
        password?: string;
        /** A pre-calculated hmacsha256(password, key) */
        passwordHMAC?: string;
        /** A pre-calculated sha256(password) */
        passwordHash?: string;
        /** The bot token of the user you're logging in with. */
        token?: string;
        /** The type of authentication. */
        type: "password" | "bot" | "token";
        /** The username of the account you're logging in with. */
        username?: string;
    };
    clientOptions?: ClientOptions;
    /** If models should use a custom inspect function. The custom inspect function will only show the RID and (if applicable) list of items for any collection or model. Defaults to `true`. */
    customInspect?: boolean;
    /** Disables most if not all tracking. This will render the vast majority of events unable to be emitted. */
    disableTracking?: boolean;
    /** If pings should be sent to prevent being released for inactivity. Defaults to `true` */
    pingCharacters?: boolean;
    track?: TrackOptions;
    resClientFactory?(this: void, client: WolferyJS): ResClient;
    wsFactory?(this: void, client: WolferyJS): WebSocket;
}

/** Things that are tracked. If a property says it `fetches` something, then we have to specifically request something from the server to track it. Otherwise, we already have what we need, and disabling the option only prevents setting up listeners and emitting events. */
export interface TrackOptions {
    /**
     * If awake characters should be tracked.
     * @default true
     * @fetches {@link AwakeCharacters}
     * @requiredForEvents
     * * {@link Events."awakeCharacters.add" | `awakeCharacters.add`}
     * * {@link Events."awakeCharacters.remove" | `awakeCharacters.remove` }
     */
    awake?: boolean;
    /**
     * If the player's bots should be tracked.
     * @playerRequired
     * @default true
     * @fetches {@link Bots}
     * @requiredForEvents
     * * {@link Events."bots.add" | `bots.add`}
     * * {@link Events."bots.remove" | `bots.remove`}
     */
    bots?: boolean;
    /**
     * If broadcasts should be tracked.
     * @default true
     * @fetches {@link CoreInfo}
     * @requiredForEvents
     * * {@link Events.broadcast | `broadcast`}
     */
    broadcast?: boolean;
    /**
     * If character info should be fetched for {@link Character} models.
     * @default true
     * @fetches {@link CharacterInfo} for all awake characters.
     * @requiredBy {@link lfrp}
     * @requiredForEvents
     * * {@link Events.aboutChange | `aboutChange`}
     * * {@link Events."lfrp.change" | `lfrp.change`}
     * * {@link Events."lfrp.descChange" | `lfrp.descChange`}
     */
    charInfo?: boolean;
    /**
     * If character info should be fetched for offline {@link Character} models.
     * @default false
     * @fetches {@link CharacterInfo} for all characters.
     */
    charInfoOffline?: boolean;
    /**
     * If character nodes should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."characterNodes.add" | `characterNodes.add`}
     * * {@link Events."characterNodes.remove" | `characterNodes.remove`}
     */
    characterNodes?: boolean;
    /**
     * If character tags should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."characterTags.add" | `characterTags.add`}
     * * {@link Events."characterTags.remove" | `characterTags.remove`}
     */
    characterTags?: boolean;
    /**
     * If characters controlled by the player should be tracked.
     * @playerRequired
     * @default true
     * @requiredForEvents
     * * {@link Events."controlledCharacters.add" | `controlledCharacters.add`}
     * * {@link Events."controlledCharacters.remove" | `controlledCharacters.remove`}
     */
    controlledCharacters?: boolean;
    /**
     * If exits should be tracked.
     * @default true
     * @requiredBy {@link hiddenExits}
     * @requiredForEvents
     * * {@link Events."exits.add" | `exits.add`}
     * * {@link Events."exits.remove" | `exits.remove`}
     */
    exits?: boolean;
    /**
     * If focused should be tracked.
     * @default true
     * @requiredBy {@link roomCharactersExit}
     * @requiredForEvents
     * * {@link Events."focus.add" | `focus.add`}
     * * {@link Events."focus.remove" | `focus.remove`}
     */
    focus?: boolean;
    /**
     * If the focused characters should be tracked.
     * @default true
     * @fetches {@link FocusChars} for all controlled characters.
     * @dependsOn {@link focus}
     * @requiredForEvents
     * * {@link Events."focusChars.add" | `focusChars.add`}
     * * {@link Events."focusChars.remove" | `focusChars.remove`}
     */
    focusChars?: boolean;
    /**
     * If global tags should be tracked.
     * @default true
     * @fetches {@link Tags}
     * @requiredForEvents
     * * {@link Events."tags.add" | `tags.add`}
     * * {@link Events."tags.remove" | `tags.remove`}
     */
    globalTags?: boolean;
    /**
     * If global teleports should be tracked.
     * @default true
     * @fetches {@link GlobalTeleports}
     * @requiredForEvents
     * * {@link Events."globalTeleports.add" | `globalTeleports.add`}
     * * {@link Events."globalTeleports.remove" | `globalTeleports.remove`}
     */
    globalTeleports?: boolean;
    /**
     * If hidden exits should be tracked.
     * @default true
     * @fetches {@link HiddenExits} for all owned rooms.
     * @requiredForEvents
     * * {@link Events."exits.hidden.add" | `exits.hidden.add`}
     * * {@link Events."exits.hidden.remove" | `exits.hidden.remove`}
     */
    hiddenExits?: boolean;
    /**
     * If idle changes should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."idleStatusChange" | `idleStatusChange`}
     */
    idle?: boolean;
    /**
     * If incoming requests should be tracked.
     * @playerRequired
     * @default true
     * @fetches {@link IncomingRequests}
     * @requiredForEvents
     * * {@link Events."requests.incoming.accepted" | `requests.incoming.accepted`}
     * * {@link Events."requests.incoming.add" | `requests.incoming.add`}
     * * {@link Events."requests.incoming.expired" | `requests.incoming.expired`}
     * * {@link Events."requests.incoming.failed" | `requests.incoming.failed`}
     * * {@link Events."requests.incoming.rejected" | `requests.incoming.rejected`}
     * * {@link Events."requests.incoming.remove" | `requests.incoming.remove`}
     * * {@link Events."requests.incoming.revoked" | `requests.incoming.revoked`}
     */
    incomingRequests?: boolean;
    /**
     * If LFRP status should be tracked.
     * @default true
     * @dependsOn {@link charInfo} for {@link Events."lfrp.descChange" | `lfrp.descChange`}
     * @requiredForEvents
     * * {@link Events."lfrp.change" | `lfrp.change`}
     * * {@link Events."lfrp.descChange" | `lfrp.descChange`}
     */
    lfrp?: boolean;
    /**
     * If the characters controlled characters are looking at should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."lookAtChange" | `lookAtChange`}
     */
    lookAt?: boolean;
    /**
     * If characters looking at a controlled character should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."lookedAt.add" | `lookedAt.add`}
     * * {@link Events."lookedAt.remove" | `lookedAt.remove`}
     */
    lookedAt?: boolean;
    /**
     * If mail should be tracked.
     * @playerRequired
     * @default true
     * @fetches {@link UnreadMail} and {@link Inbox}
     * @requiredForEvents
     * * {@link Events."inbox.add" | `inbox.add`}
     * * {@link Events."inbox.remove" | `inbox.remove`}
     * * {@link Events."unreadMail.add" | `unreadMail.add`}
     * * {@link Events."unreadMail.remove" | `unreadMail.remove`}
     */
    mail?: boolean;
    /**
     * If messages should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."message" | `message`}
     */
    messages?: boolean;
    /**
     * If missing collections, errors, models, and properties should be tracked. Useful for development.
     * @default false
     * @requiredForEvents
     * * {@link Events.missingCollection | `missingCollection`}
     * * {@link Events.missingError | `missingError`}
     * * {@link Events.missingModel | `missingModel`}
     * * {@link Events.missingProperties | `missingProperties`}
     */
    missing?: boolean;
    /**
     * If muted characters should be tracked.
     * @playerRequired
     * @default true
     * @requiredForEvents
     * * {@link Events."mutedCharacters.add" | `mutedCharacters.add`}
     * * {@link Events."mutedCharacters.remove" | `mutedCharacters.remove`}
     */
    mutedCharacters?: boolean;
    /**
     * If note changes should be tracked.
     * @playerRequired
     * @default false
     * @fetches
     * Each {@link Note} individually, and keeps them cached. This can potentially flood the server on startup.
     * Note however that keeping this disabled will also prevent listening to changes on full notes we receive via other means.
     * @requiredForEvents
     * * {@link Events."notes.textChange" | `notes.textChange`}
     */
    noteChanges?: boolean;
    /**
     * If note additions & removals should be tracked. This will not track text changes in individual notes.
     * @playerRequired
     * @default true
     * @fetches {@link Notes}
     * @requiredForEvents
     * * {@link Events."notes.add" | `notes.add`}
     * * {@link Events."notes.remove" | `notes.remove`}
     */
    notes?: boolean;
    /**
     * If notices should be tracked.
     * @playerRequired
     * @default true
     * @fetches {@link AuthNotices} and {@link IdentityNotices}
     * @requiredForEvents
     * * {@link Events."notices.auth.add" | `notices.auth.add`}
     * * {@link Events."notices.auth.remove" | `notices.auth.remove`}
     * * {@link Events."notices.identity.add" | `notices.identity.add`}
     * * {@link Events."notices.identity.remove" | `notices.identity.remove`}
     */
    notices?: boolean;
    /**
     * If outgoing requests should be tracked.
     * @playerRequired
     * @default true
     * @fetches {@link OutgoingRequests}
     * @requiredForEvents
     * * {@link Events."requests.outgoing.accepted" | `requests.outgoing.accepted`}
     * * {@link Events."requests.outgoing.add" | `requests.outgoing.add`}
     * * {@link Events."requests.outgoing.expired" | `requests.outgoing.expired`}
     * * {@link Events."requests.outgoing.failed" | `requests.outgoing.failed`}
     * * {@link Events."requests.outgoing.rejected" | `requests.outgoing.rejected`}
     * * {@link Events."requests.outgoing.remove" | `requests.outgoing.remove`}
     * * {@link Events."requests.outgoing.revoked" | `requests.outgoing.revoked`}
     */
    outgoingRequests?: boolean;
    /**
     * If areas owned by controlled characters should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."ownedAreas.add" | `ownedAreas.add`}
     * * {@link Events."ownedAreas.remove" | `ownedAreas.remove`}
     */
    ownedAreas?: boolean;
    /**
     * If characters owned by the player should be tracked.
     * @playerRequired
     * @default true
     * @requiredForEvents
     * * {@link Events."ownedCharacters.add" | `ownedCharacters.add`}
     * * {@link Events."ownedCharacters.remove" | `ownedCharacters.remove`}
     */
    ownedCharacters?: boolean;
    /**
     * If rooms owned by controlled characters should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."ownedRooms.add" | `ownedRooms.add`}
     * * {@link Events."ownedRooms.remove" | `ownedRooms.remove`}
     */
    ownedRooms?: boolean;
    /**
     * If population changes should be tracked.
     * @default true
     * @requiredForEvents
     * {@link Events."area.child.populationChange" | `area.child.populationChange`}
     * {@link Events."area.details.populationChange" | `area.details.populationChange`}
     * {@link Events."room.child.populationChange" | `room.child.populationChange`}
     * {@link Events."room.details.populationChange" | `room.details.populationChange`}
     */
    population?: boolean;
    /**
     * If the profiles of controlled characters should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."profiles.add" | `profiles.add`}
     * * {@link Events."profiles.remove" | `profiles.remove`}
     */
    profiles?: boolean;
    /**
     * If puppets should be tracked.
     * @playerRequired
     * @default true
     * @requiredForEvents
     * * {@link Events."puppets.add" | `puppets.add`}
     * * {@link Events."puppets.remove" | `puppets.remove`}
     */
    puppets?: boolean;
    /**
     * If the controlled & owned character's current room changes should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."roomChange.details" | `roomChange.details`}
     * * {@link Events.roomChange | `roomChange`}
     */
    roomChange?: boolean;
    /**
     * If characters in the current room should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."roomCharacters.add" | `roomCharacters.add`}
     * * {@link Events."roomCharacters.remove" | `roomCharacters.remove`}
     */
    roomCharacters?: boolean;
    /**
     * If characters in rooms adjacent to the current room should be tracked.
     * @default true
     * @dependsOn {@link exits}
     * @requiredForEvents
     * * {@link Events."roomCharacters.exit.add" | `roomCharacters.exit.add`}
     * * {@link Events."roomCharacters.exit.remove" | `roomCharacters.exit.remove`}
     */
    roomCharactersExit?: boolean;
    /**
     * If commands in the current room should be tracked.
     * @default true
     * @requiredForEvents
     * * {@link Events."roomCommands.add" | `roomCommands.add`}
     * * {@link Events."roomCommands.remove" | `roomCommands.remove`}
     */
    roomCommands?: boolean;
    /**
     * If profiles in the current room should be tracked.
     * @default true
     * @fetches {@link RoomProfiles} if the current room is owned.
     * @requiredForEvents
     * * {@link Events."roomProfiles.add" | `roomProfiles.add`}
     * * {@link Events."roomProfiles.remove" | `roomProfiles.remove`}
     */
    roomProfiles?: boolean;
    /**
     * If scripts in the current room should be tracked.
     * @default true
     * @fetches {@link RoomScripts} if the current room is owned.
     * @requiredForEvents
     * * {@link Events."roomScripts.add" | `roomScripts.add`}
     * * {@link Events."roomScripts.remove" | `roomScripts.remove`}
     */
    roomScripts?: boolean;
    /**
     * If tag groups should be tracked.
     * @playerRequired
     * @default true
     * @fetches {@link TagGroups}
     * @requiredForEvents
     * * {@link Events."tagGroups.add" | `tagGroups.add`}
     * * {@link Events."tagGroups.remove" | `tagGroups.remove`}
     */
    tagGroups?: boolean;
    /**
     * If the player's tokens should be tracked.
     * @playerRequired
     * @default true
     * @fetches {@link Tokens}
     * @requiredForEvents
     * * {@link Events."tokens.add" | `tokens.add`}
     * * {@link Events."tokens.remove" | `tokens.remove`}
     */
    tokens?: boolean;
    /**
     * If the player's watches should be tracked.
     * @playerRequired
     * @default true
     * @fetches {@link Watches}
     * @requiredForEvents
     * * {@link Events."watches.add" | `watches.add`}
     * * {@link Events."watches.remove" | `watches.remove`}
     */
    watches?: boolean;
}

export interface InstanceOptions {
    authentication: PasswordAuthentication | BotAuthentication | TokenAuthentication;
    clientOptions: ClientOptions;
    customInspect: boolean;
    disableTracking: boolean;
    domain: string;
    pingCharacters: boolean;
    track: Required<TrackOptions>;
    resClientFactory(this: void, client: WolferyJS): ResClient;
    wsFactory(this: void, client: WolferyJS): WebSocket;
}

export type AnyUser = User | TokenUser | BotUser;
/**
 * The main client. For the client options, see {@link Options}. For the events that can be listened to, see {@link Events}.
 */
export default class WolferyJS<U extends AnyUser = AnyUser> extends TypedEmitter<Events> {
    private _player!: Player | null;
    private _res!: ResClient | null;
    private _user!: U | null;
    commands!: Commands;
    onUnsubscribe = this._onUnsubscribe.bind(this);
    options!: InstanceOptions;
    constructor(options: Options) {
        super();
        if (options === undefined) {
            throw new Error("No options provided");
        }
        options.clientOptions ??= {};
        options.clientOptions.retryOnTooActive ??= true;

        let authOptions: InstanceOptions["authentication"] | undefined;
        if (typeof options.authentication.token === "string") {
            authOptions = {
                type:  options.authentication.type as "bot" | "token",
                token: options.authentication.token
            };
        } else if (typeof options.authentication.username === "string") {
            if (typeof options.authentication.password === "string") {
                const HMACKey = options.authentication.HMACKey ?? PublicPepper;
                const passwordHash = createHash("sha256").update(options.authentication.password).digest("base64");
                const passwordHMAC = createHmac("sha256", HMACKey).update(options.authentication.password).digest("base64");
                authOptions = {
                    type:     "password",
                    hash:     passwordHash,
                    hmac:     passwordHMAC,
                    username: options.authentication.username
                };
            } else if (typeof options.authentication.passwordHash === "string" && typeof options.authentication.passwordHMAC === "string") {
                authOptions = {
                    type:     "password",
                    hash:     options.authentication.passwordHash,
                    hmac:     options.authentication.passwordHMAC,
                    username: options.authentication.username
                };
            }
        }

        if (authOptions === undefined) throw new TypeError("Missing or invalid authentication.");


        const authRequired = (v: boolean, auth: AuthTypes | Array<AuthTypes>): boolean => v && (Array.isArray(auth) ? auth.includes(authOptions.type) : auth === authOptions.type);
        const instanceOptions = {
            authentication: authOptions,
            clientOptions:  {
                ...options.clientOptions,
                defaultCollectionFactory: (api, rid, data): ResCollection => this._missingRes("collection", api, rid, data, options.clientOptions?.defaultCollectionFactory),
                defaultErrorFactory:      (api, rid, data): ResError => this._missingRes("error", api, rid, data, options.clientOptions?.defaultErrorFactory),
                defaultModelFactory:      (api, rid, data): ResModel => this._missingRes("model", api, rid, data, options.clientOptions?.defaultModelFactory)
            },
            customInspect:   options.customInspect ?? true,
            disableTracking: options.disableTracking ?? false,
            domain:          options.apiDomain ?? "wolfery.com",
            track:           {
                awake:                options.disableTracking ? false : options.track?.awake ?? true,
                bots:                 options.disableTracking ? false : authRequired(options.track?.bots ?? true, "password"),
                broadcast:            options.disableTracking ? false : options.track?.broadcast ?? true,
                charInfo:             options.disableTracking ? false : options.track?.charInfo ?? true,
                charInfoOffline:      options.disableTracking ? false : options.track?.charInfoOffline ?? false,
                characterNodes:       options.disableTracking ? false : options.track?.characterNodes ?? true,
                characterTags:        options.disableTracking ? false : options.track?.characterTags ?? true,
                controlledCharacters: options.disableTracking ? false : authRequired(options.track?.controlledCharacters ?? true, "password"),
                exits:                options.disableTracking ? false : options.track?.exits ?? true,
                focus:                options.disableTracking ? false : options.track?.focus ?? true,
                focusChars:           options.disableTracking ? false : options.track?.focusChars ?? true,
                globalTags:           options.disableTracking ? false : options.track?.globalTags ?? true,
                globalTeleports:      options.disableTracking ? false : options.track?.globalTeleports ?? true,
                hiddenExits:          options.disableTracking ? false : options.track?.hiddenExits ?? true,
                idle:                 options.disableTracking ? false : options.track?.idle ?? true,
                incomingRequests:     options.disableTracking ? false : authRequired(options.track?.incomingRequests ?? true, "password"),
                lfrp:                 options.disableTracking ? false : options.track?.lfrp ?? true,
                lookAt:               options.disableTracking ? false : options.track?.lookAt ?? true,
                lookedAt:             options.disableTracking ? false : options.track?.lookedAt ?? true,
                mail:                 options.disableTracking ? false : authRequired(options.track?.mail ?? true, "password"),
                messages:             options.disableTracking ? false : options.track?.messages ?? true,
                missing:              options.disableTracking ? false : options.track?.missing ?? false,
                mutedCharacters:      options.disableTracking ? false : authRequired(options.track?.mutedCharacters ?? true, "password"),
                noteChanges:          options.disableTracking ? false : authRequired(options.track?.noteChanges ?? false, "password"),
                notes:                options.disableTracking ? false : authRequired(options.track?.notes ?? true, "password"),
                notices:              options.disableTracking ? false : authRequired(options.track?.notices ?? true, "password"),
                outgoingRequests:     options.disableTracking ? false : authRequired(options.track?.outgoingRequests ?? true, "password"),
                ownedAreas:           options.disableTracking ? false : options.track?.ownedAreas ?? true,
                ownedCharacters:      options.disableTracking ? false : authRequired(options.track?.ownedCharacters ?? true, "password"),
                ownedRooms:           options.disableTracking ? false : options.track?.ownedRooms ?? true,
                population:           options.disableTracking ? false : options.track?.population ?? true,
                profiles:             options.disableTracking ? false : options.track?.profiles ?? true,
                puppets:              options.disableTracking ? false : authRequired(options.track?.puppets ?? true, "password"),
                roomChange:           options.disableTracking ? false : options.track?.roomChange ?? true,
                roomCharacters:       options.disableTracking ? false : options.track?.roomCharacters ?? true,
                roomCharactersExit:   options.disableTracking ? false : options.track?.roomCharactersExit ?? true,
                roomCommands:         options.disableTracking ? false : options.track?.roomCommands ?? true,
                roomProfiles:         options.disableTracking ? false : options.track?.roomProfiles ?? true,
                roomScripts:          options.disableTracking ? false : options.track?.roomScripts ?? true,
                tagGroups:            options.disableTracking ? false : authRequired(options.track?.tagGroups ?? true, "password"),
                tokens:               options.disableTracking ? false : authRequired(options.track?.tokens ?? true, "password"),
                watches:              options.disableTracking ? false : authRequired(options.track?.watches ?? true, "password")
            },
            pingCharacters:   options.pingCharacters ?? true,
            wsFactory:        options.wsFactory ?? ((client: WolferyJS): WebSocket => new WebSocket(client.wsURL, { handshakeTimeout: 5000 })),
            resClientFactory: options.resClientFactory ?? ((client: WolferyJS): ResClient => new ResClient(() => client.options.wsFactory(client), client.options.clientOptions))
        } satisfies InstanceOptions;

        Properties.of(this)
            .writable("_res", null)
            .writable("_player", null)
            .writable("_user", null)
            .readOnly("commands", new Commands(this))
            .readOnly("onUnsubscribe")
            .readOnly("options", instanceOptions);

        if (this.options.customInspect) {
            enableCustomInspectForCollections();
            enableCustomInspectForCollectionModels();
            enableCustomInspectForModels();
        }
    }

    private async _afterAuthenticate(type: "password" | "token" | "bot"): Promise<void> {
        const promises: Array<Promise<unknown>> = [];
        const player = type === "password" ? await this.commands.core.getPlayer() : null;
        if (this.anyTracked("awake")) promises.push(this.api.subscribe(ResourceIDs.AWAKE_CHARACTERS, true));
        if (this.anyTracked("broadcast")) promises.push(this.api.subscribe(ResourceIDs.CORE_INFO, true));
        if (this.anyTracked("globalTags")) promises.push(this.api.subscribe(ResourceIDs.TAGS, true));
        if (this.anyTracked("globalTeleports")) promises.push(this.api.subscribe(ResourceIDs.NODES, true));
        if (this.anyTracked("tagGroups")) promises.push(this.api.subscribe(ResourceIDs.TAG_GROUPS, true));
        if (this.anyTracked("watches") && player) promises.push(this.api.subscribe(ResourceIDs.WATCHES({ id: player.id }), true));
        if (this.anyTracked("mail") && player) promises.push(this.api.subscribe(ResourceIDs.UNREAD_MAIL({ id: player.id }), true));
        if (this.anyTracked("incomingRequests") && player) promises.push(this.api.subscribe(ResourceIDs.INCOMING_REQUESTS({ id: player.id }), true));
        if (this.anyTracked("outgoingRequests") && player) promises.push(this.api.subscribe(ResourceIDs.OUTGOING_REQUESTS({ id: player.id }), true));
        if (this.anyTracked("bots") && player) promises.push(this.api.subscribe(ResourceIDs.BOTS({ id: player.id }), true));
        if (this.anyTracked("tokens") && player) promises.push(this.api.subscribe(ResourceIDs.TOKENS({ id: player.id }), true));
        if (this.anyTracked("notices") && player) promises.push(this.api.subscribe(ResourceIDs.AUTH_NOTICES({ id: player.id }), true), this.api.subscribe(ResourceIDs.IDENTITY_NOTICES({ id: player.id }), true));
        if (this.anyTracked("notes") && player) {
            if (this.anyTracked("noteChanges")) {
                const notes = await this.api.get<Notes>(ResourceIDs.NOTES({ id: player.id }), true);
                for (const note of notes.list) {
                    promises.push(this.api.get(note.rid, true));
                }
            } else {
                promises.push(this.api.get(ResourceIDs.NOTES({ id: player.id }), true));
            }
        }

        await Promise.all(promises);
        await this.commands.core._track(true);
    }

    private async _authenticateBot(): Promise<{ user: BotUser; }> {
        if (this.options.authentication.type !== "bot") {
            throw new Error("Invalid authentication type");
        }

        return this.api.authenticate<null>("auth", "authenticateBot", {
            token: this.options.authentication.token
        })
            .then(async() => {
                const user = await this.commands.core.getBotUser();
                this.emit("authenticated");
                this.emit("authenticated.bot", user);
                await this._afterAuthenticate("bot");
                return { user };
            })
            .catch(this._handleError.bind(this));
    }

    private async _authenticatePassword(): Promise<{ player: Player; user: User; }> {
        if (this.options.authentication.type !== "password") {
            throw new Error("Invalid authentication type");
        }

        return this.api.authenticate<null>("auth", "login", {
            name: this.options.authentication.username,
            pass: this.options.authentication.hash,
            hash: this.options.authentication.hmac
        })
            .then(async() => {
                const user = await this.commands.core.getPlayerUser();
                const player = await this.commands.core.getPlayer();
                this.emit("authenticated");
                this.emit("authenticated.player", user, player);
                await this._afterAuthenticate("password");
                return { user, player };
            })
            .catch(this._handleError.bind(this));
    }

    private async _authenticateToken(): Promise<{ user: TokenUser; }> {
        if (this.options.authentication.type !== "token") {
            throw new Error("Invalid authentication type");
        }

        return this.api.authenticate<null>("auth", "authenticate", {
            token: this.options.authentication.token
        })
            .then(async() => {
                const user = await this.commands.core.getTokenUser();
                this.emit("authenticated");
                this.emit("authenticated.token", user);
                await this._afterAuthenticate("token");
                return { user };
            })
            .catch(this._handleError.bind(this));
    }

    // we pass in res to ensure it's asserted to be a ResClient
    private _ensureRes(res: unknown): asserts res is ResClient {
        if (res === null) {
            throw new Error("RES was attempted to be used before it was initialized");
        }
    }

    // an error should always be re-thrown, so this will never return anything
    private _handleError(error: unknown): never {
        if (error instanceof ResError) {
            switch (error.code) {
                case ErrorCodes.UNKNOWN_USER: {
                    throw new Error("Unknown User", {
                        cause: error
                    });
                }
            }
        }

        // ResError is an instance of Error
        if (error instanceof Error) {
            throw error;
        }

        throw new TypeError("Unknown error (who throws a non-error object anyways?)", {
            cause: error
        });
    }

    private _missingRes<T = unknown>(type: ResourceType, api: ResClient, rid: string, data: Record<string, unknown> | undefined, factory?: ItemFactory<T>): T {
        switch (type) {
            case "collection": {
                if (this.anyTracked("missing")) this.emit("missingCollection", rid);
                return factory ? factory(api, rid, data) : new ResCollection(api, rid) as T;
            }

            case "error": {
                if (this.anyTracked("missing")) this.emit("missingError", rid);
                return factory ? factory(api, rid, data) : new ResError(api, rid) as T;
            }

            case "model": {
                if (this.anyTracked("missing")) this.emit("missingModel", rid);
                return factory ? factory(api, rid, data) : new ResModel(api, rid) as T;
            }
        }
    }

    private async _onUnsubscribe(): Promise<void> {
        await this._res?.disconnect();
        this._player = null;
        this._user = null;
        this._res = null;
        this.emit("unsubscribe");
    }

    /** Access to the RES client - this will throw an error if we aren't connected */
    get api(): ResClient {
        this._ensureRes(this._res);
        return this._res;
    }

    get apiURL(): string {
        return `https://api.${this.options.domain}`;
    }

    get connected(): boolean {
        return this.resConnected && this.wsConnected;
    }

    get fileURL(): string {
        return `https://file.${this.options.domain}`;
    }

    get player(): Player | null {
        return this._player;
    }

    get resConnected(): boolean {
        return this._res !== null && this._res.connected;
    }

    get user(): U | null {
        return this._user;
    }

    get wsConnected(): boolean {
        return this.resConnected && this._res!.ws !== null && this._res!.ws.readyState === WebSocket.OPEN;
    }

    get wsURL(): string {
        return `wss://api.${this.options.domain}`;
    }

    anyTracked(...types: Array<keyof TrackOptions>): boolean {
        return types.some(type => this.options.track?.[type] ?? false);
    }

    async connect(force = false): Promise<void> {
        if (this.resConnected || this.wsConnected) {
            if (force) {
                await this._res?.disconnect();
            } else {
                throw new Error("Already connected");
            }
        }

        const res = this._res = this.options.resClientFactory(this);
        registerCollections(this, res);
        registerModels(this, res);
        res.setOnConnect(async() => {
            this._res!.ws!.addEventListener("message", data => this.emit("raw", data));
            switch (this.options.authentication.type) {
                case "password": {
                    ({ user: this._user as AnyUser, player: this._player } = await this._authenticatePassword());

                    break;
                }
                case "bot": {
                    ({ user: this._user as AnyUser } = await this._authenticateBot());

                    break;
                }
                case "token": {
                    ({ user: this._user as AnyUser } = await this._authenticateToken());

                    break;
                }
                default: {
                    throw new Error(`Invalid authentication type: ${(this.options.authentication as { type: string; }).type}`);
                }
            }
            this.emit("connected");
            switch (this.options.authentication.type) {
                case "password": {
                    this.emit("connected.player", this._user as User, this._player as Player);
                    break;
                }
                case "bot": {
                    this.emit("connected.bot", this._user as BotUser);
                    break;
                }
                case "token": {
                    this.emit("connected.token", this._user as TokenUser);
                    break;
                }
            }
        }, (api, err) => this.emit("error", err));
        await res.connect();
    }

    async disconnect(): Promise<void> {
        await this._res?.disconnect();
        this._player = null;
        this._user = null;
        this._res = null;
        await this.commands.core._track(false);
        this.emit("disconnected");
    }

    async findControlledCharacter(cb: (ctrl: ControlledCharacter) => Promise<boolean> | boolean, error: true): Promise<ControlledCharacter>;
    async findControlledCharacter(cb: (ctrl: ControlledCharacter) => Promise<boolean> | boolean, error?: false): Promise<ControlledCharacter | null>;
    async findControlledCharacter(cb: (ctrl: ControlledCharacter) => Promise<boolean> | boolean, error = false): Promise<ControlledCharacter | null> {
        if (this.isBot() && this.user) {
            if (this.user.controlled && await cb(this.user.controlled)) return this.user.controlled;
            if (error) throw new Error("Could not find ControlledCharacter");
            return null;
        }

        if (this.isPlayer() && this.player) {
            for (const ctrl of this.player.controlled) {
                if (await cb(ctrl)) return ctrl;
            }
            if (error) throw new Error("Could not find ControlledCharacter");
            return null;
        }

        if (error) throw new Error("Could not find ControlledCharacter");
        return null;
    }

    async getAllPaginated<T extends ResModel>(resourceId: string, pageSize = 10): Promise<Array<T>> {
        this._ensureRes(this._res);
        const results: Array<T> = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            const response = await this.api.getPaginated<T>(resourceId, offset, pageSize);
            results.push(...response);
            hasMore = response.length === pageSize;
            offset += pageSize;
        }

        return results;
    }

    async getChar(id: string): Promise<Character> {
        const rid = ResourceIDs.CHARACTER({ id });
        const cached = this.api.getCached<Character>(rid);
        if (cached) return cached;
        return this.api.get<Character>(rid);
    }

    getControlledCharacter(id: string, error: true): ControlledCharacter;
    getControlledCharacter(id: string, error?: false): ControlledCharacter | null;
    getControlledCharacter(id: string, error = false): ControlledCharacter | null {
        const rid = ResourceIDs.CONTROLLED_CHARACTER({ id });
        const cached = this.api.getCached<ControlledCharacter>(rid);
        if (cached) return cached;
        if (error) throw new Error(`ControlledCharacter with ID ${id} not found`);
        return null;
    }

    /** If the authentication used was for a {@link BotUser}. */
    isBot(): this is WolferyJS<BotUser> {
        return (this._user && this._user instanceof BotUser) ?? false;
    }

    async isCharacterOurs(charId: string): Promise<boolean> {
        const player = await this.commands.core.getPlayer();
        return player.chars.hasKey(charId);
    }

    async isCharacterOursControlled(charId: string): Promise<boolean> {
        const player = await this.commands.core.getPlayer();
        return player.controlled.hasKey(charId);
    }

    /** If the authentication used was for a {@link User} and {@link Player}. */
    isPlayer(): this is WolferyJS<User> {
        return this.isUser() && this._player !== null;
    }

    async isPlayerUs(playerId: string): Promise<boolean> {
        const player = await this.commands.core.getPlayer();
        return player.id === playerId;
    }

    /** If the authentication used was for a {@link TokenUser}. */
    isToken(): this is WolferyJS<TokenUser> {
        return (this._user && this._user instanceof TokenUser) ?? false;
    }

    /** If the authentication used was for a {@link User}. */
    isUser(): this is WolferyJS<User> {
        return (this._user && this._user instanceof User) ?? false;
    }

    playerOrThrow(): Player {
        assert(this._player !== null, "Player not present");
        return this._player;
    }

    userOrThrow(): U {
        assert(this._user !== null, "User not present");
        return this._user;
    }

    async waitForCached<T extends AnyRes>(rid: string, options?: WaitForCachedOptions<T>): Promise<T> {
        return waitForCached(this, rid, options);
    }

    async waitForEvent<T = AnyObject>(rid: string, event: string, options?: WaitForEventOptions<T>): Promise<T> {
        return waitForEvent<T>(this, rid, event, options);
    }

    async wakeupChar(char: OwnedCharacter | ControlledCharacter, hidden = false): Promise<ControlledCharacter> {
        if (char instanceof ControlledCharacter) {
            await char.wakeup(hidden);
            return char;
        }

        if (this.isBot()) {
            return this.user!.wakeup(hidden);
        }

        return this.commands.core.getPlayer().then(player => player.controlChar(char.id, true)
            .then(ctrl => ((ctrl.wakeup(hidden, true), ctrl))));
    }
}
