import type { BotAuthentication, PasswordAuthentication, TokenAuthentication } from "./util/types.js";
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
import Modules from "./modules/Modules.js";
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
    /** If pings should be sent to prevent being released for inactivity. Defaults to `true` */
    pingCharacters?: boolean;
    /** Set to false to not fetch anything extra on startup. This takes precedent over all of the track options. */
    startup?: boolean;
    track?: {
        /** If awake characters should be tracked. Defaults to `true`. */
        awake?: boolean;
        /** If the player's bots should be tracked. Defaults to `true`. */
        bots?: boolean;
        /** If broadcasts should be tracked. Defaults to `true`. */
        broadcast?: boolean;
        /** If character info should be fetched for {@link Chracter} models. Required for seeing about/lfrpDesc changes. Defaults to `false`. See also {@link charInfo} */
        charInfo?: boolean;
        /** If character info should be fetched for offline {@link Character} models. Defaults to `false`. */
        charInfoOffline?: boolean;
        /** If incoming requests should be tracked. Defaults to `true`. */
        incomingRequests?: boolean;
        /** If unread mail should be tracked. Defaults to `true` if `authentication.type` === "password", has no effect otherwise. */
        mail?: boolean;
        /** If note changes should be tracked. Each note must be fetched individually to track changes, so this can potentially flood the server with requests and expand the cache significantly. */
        noteChanges?: boolean;
        /** If note additions & removals should be tracked. This will not track text changes in individual notes. Defaults to `true` */
        notes?: boolean;
        /** If outgoing requests should be tracked. Defaults to `true`. */
        outgoingRequests?: boolean;
        /** If the player's tokens should be tracked. Defaults to `true`. */
        tokens?: boolean;
        /** If watched characters should be tracked. Defaults to the same as `trackAwake`. */
        watched?: boolean;
    };
    resClientFactory?(this: void, client: WolferyJS): ResClient;
    wsFactory?(this: void, client: WolferyJS): WebSocket;
}

export interface InstanceOptions {
    authentication: PasswordAuthentication | BotAuthentication | TokenAuthentication;
    clientOptions: ClientOptions;
    domain: string;
    pingCharacters: boolean;
    startup: boolean;
    track: {
        awake: boolean;
        bots: boolean;
        broadcast: boolean;
        charInfo: boolean;
        charInfoOffline: boolean;
        incomingRequests: boolean;
        mail: boolean;
        noteChanges: boolean;
        notes: boolean;
        outgoingRequests: boolean;
        tokens: boolean;
        watched: boolean;
    };
    resClientFactory(this: void, client: WolferyJS): ResClient;
    wsFactory(this: void, client: WolferyJS): WebSocket;
}

type AnyUser = User | TokenUser | BotUser;
export default class WolferyJS<U extends AnyUser = AnyUser> extends TypedEmitter<Events> {
    private _player!: Player | null;
    private _res!: ResClient | null;
    private _user!: U | null;
    modules!: Modules;
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


        const instanceOptions = {
            authentication: authOptions,
            clientOptions:  {
                ...options.clientOptions,
                defaultCollectionFactory: (api, rid): ResCollection => this._missingRes("collection", api, rid, options.clientOptions?.defaultCollectionFactory),
                defaultErrorFactory:      (api, rid): ResError => this._missingRes("error", api, rid, options.clientOptions?.defaultErrorFactory),
                defaultModelFactory:      (api, rid): ResModel => this._missingRes("model", api, rid, options.clientOptions?.defaultModelFactory)
            },
            domain:  options.apiDomain ?? "wolfery.com",
            startup: options.startup ?? false,
            track:   {
                awake:            options.track?.awake ?? true,
                bots:             options.track?.bots ?? true,
                broadcast:        options.track?.broadcast ?? true,
                charInfo:         options.track?.charInfo ?? false,
                charInfoOffline:  options.track?.charInfoOffline ?? false,
                incomingRequests: options.track?.incomingRequests ?? true,
                mail:             options.track?.mail ?? options.authentication.type === "password",
                noteChanges:      options.track?.noteChanges ?? false,
                notes:            options.track?.notes ?? true,
                outgoingRequests: options.track?.outgoingRequests ?? true,
                tokens:           options.track?.tokens ?? true,
                watched:          options.track?.watched ?? options.track?.awake ?? true
            },
            pingCharacters:   options.pingCharacters ?? true,
            wsFactory:        options.wsFactory ?? ((client: WolferyJS): WebSocket => new WebSocket(client.wsURL, { handshakeTimeout: 5000 })),
            resClientFactory: options.resClientFactory ?? ((client: WolferyJS): ResClient => new ResClient(() => client.options.wsFactory(client), client.options.clientOptions))
        } satisfies InstanceOptions;

        Properties.of(this)
            .writable("_res", null)
            .writable("_player", null)
            .writable("_user", null)
            .readOnly("modules", new Modules(this))
            .readOnly("onUnsubscribe")
            .readOnly("options", instanceOptions);
    }

    private async _afterAuthenticate(type: "password" | "token" | "bot"): Promise<void> {
        const promises: Array<Promise<unknown>> = [];
        if (this.options.startup) {
            if (this.options.track.awake) {
                promises.push(this.api.subscribe(ResourceIDs.AWAKE_CHARACTERS, true));
            }

            if (type === "password") {
                const player = await this.modules.core.getPlayer();
                if (this.options.track.awake) {
                    promises.push(this.api.subscribe(ResourceIDs.WATCHES({ id: player.id }), true));
                }
                if (this.options.track.mail) {
                    promises.push(this.api.subscribe(ResourceIDs.UNREAD_MAIL({ id: player.id }), true));
                }
                if (this.options.track.incomingRequests) {
                    promises.push(this.api.subscribe(ResourceIDs.INCOMING_REQUESTS({ id: player.id }), true));
                }
                if (this.options.track.outgoingRequests) {
                    promises.push(this.api.subscribe(ResourceIDs.OUTGOING_REQUESTS({ id: player.id }), true));
                }
                if (this.options.track.bots) {
                    promises.push(this.api.subscribe(ResourceIDs.BOTS({ id: player.id }), true));
                }
                if (this.options.track.tokens) {
                    promises.push(this.api.subscribe(ResourceIDs.TOKENS({ id: player.id }), true));
                }
                if (this.options.track.broadcast) {
                    promises.push(this.api.subscribe(ResourceIDs.CORE_INFO, true));
                }
                if (this.options.track.notes) {
                    if (this.options.track.noteChanges) {
                        const notes = await this.api.get<Notes>(ResourceIDs.NOTES({ id: player.id }), true);
                        for (const note of notes.list) {
                            promises.push(this.api.get(note.rid, true));
                        }
                    } else {
                        promises.push(this.api.get(ResourceIDs.NOTES({ id: player.id }), true));
                    }
                }
            }
        }

        await Promise.all(promises);
    }

    private async _authenticateBot(): Promise<{ user: BotUser; }> {
        if (this.options.authentication.type !== "bot") {
            throw new Error("Invalid authentication type");
        }

        return this.api.authenticate<null>("auth", "authenticateBot", {
            token: this.options.authentication.token
        })
            .then(async() => {
                const user = await this.modules.core.getBotUser();
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
                const user = await this.modules.core.getFullUser();
                const player = await this.modules.core.getPlayer();
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
                const user = await this.modules.core.getTokenUser();
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

    private _missingRes<T = unknown>(type: ResourceType, api: ResClient, rid: string, factory?: ItemFactory<T>): T {
        switch (type) {
            case "collection": {
                this.emit("missingCollection", rid);
                return factory ? factory(api, rid) : new ResCollection(api, rid) as T;
            }

            case "error": {
                this.emit("missingError", rid);
                return factory ? factory(api, rid) : new ResError(api, rid) as T;
            }

            case "model": {
                this.emit("missingModel", rid);
                return factory ? factory(api, rid) : new ResModel(api, rid) as T;
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
            this.emit("connected", this._user! as User, this._player as Player);
        }, (api, err) => this.emit("error", err));
        await res.connect();
    }

    async disconnect(): Promise<void> {
        await this._res?.disconnect();
        this._player = null;
        this._user = null;
        this._res = null;
        this.emit("disconnected");
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

    async getCharacterInRoom(roomId: string): Promise<ControlledCharacter | null> {
        if (this.isBot()) {
            if (this._user?.char.inRoom.id === roomId) return this._user.controlled;
        } else if (this.isPlayer()) {
            const char = this._player?.controlled.find(c => c.state === "awake" && c.inRoom.id === roomId);
            if (char) return char;
        }
        return null;
    }

    /** If the authentication used was for a {@link BotUser}. */
    isBot(): this is WolferyJS<BotUser> {
        return (this._user && this._user instanceof BotUser) ?? false;
    }

    async isCharacterOurs(charId: string): Promise<boolean> {
        const player = await this.modules.core.getPlayer();
        return player.chars.hasKey(charId);
    }

    async isCharacterOursControlled(charId: string): Promise<boolean> {
        const player = await this.modules.core.getPlayer();
        return player.controlled.hasKey(charId);
    }

    /** If the authentication used was for a {@link User} and {@link Player}. */
    isPlayer(): this is WolferyJS<User> {
        return this.isUser() && this._player !== null;
    }

    async isPlayerUs(playerId: string): Promise<boolean> {
        const player = await this.modules.core.getPlayer();
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
            const ctrl = await this.user!.controlChar();
            return ctrl.wakeup(hidden);
        }

        if (this.isToken()) {
            // @TODO
            throw new Error("don't know how to wakeup a character with a token user");
        }

        return this.modules.core.getPlayer().then(player => player.controlChar(char.id, true)
            .then(ctrl => ((ctrl.wakeup(hidden, true), ctrl))));
    }
}
