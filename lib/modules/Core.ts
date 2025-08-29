import Base from "./Base.js";
import type GlobalTeleports from "../collections/GlobalTeleports.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type AwakeCharacters from "../models/AwakeCharacters.js";
import type BotUser from "../models/BotUser.js";
import type CoreInfo from "../models/CoreInfo.js";
import type MailInfo from "../models/MailInfo.js";
import type NoteInfo from "../models/NoteInfo.js";
import type Player from "../models/Player.js";
import type ReportInfo from "../models/ReportInfo.js";
import TokenUser from "../models/TokenUser.js";
import type SupportInfo from "../models/SupportInfo.js";
import type TagGroups from "../models/TagGroups.js";
import type TagInfo from "../models/TagInfo.js";
import type Tags from "../models/Tags.js";
import type User from "../models/User.js";
import type WebClientInfo from "../models/WebClientInfo.js";
import { type Messages, type Info } from "../util/types.js";
import type WolferyJS from "../WolferyJS.js";
import { kEvents } from "../util/Util.js";
import { Properties } from "resclient-ts";

/** Core classes/calls that don't require any id input */
export default class Core extends Base {
    private _awakeCharacters!: AwakeCharacters | null;
    private _botUser!: BotUser | null;
    private _coreInfo!: CoreInfo | null;
    private _globalTeleports!: GlobalTeleports | null;
    private _player!: Player | null;
    private _playerUser!: User | null;
    private _tagGroups!: TagGroups | null;
    private _tags!: Tags | null;
    private _tokenUser!: TokenUser | null;
    private _user!: User | TokenUser | null;
    private onCoreInfoOut = this._onCoreInfoOut.bind(this);
    constructor(client: WolferyJS) {
        super(client);
        Properties.of(this)
            .writable("_awakeCharacters", null)
            .writable("_botUser", null)
            .writable("_coreInfo", null)
            .writable("_globalTeleports", null)
            .writable("_player", null)
            .writable("_playerUser", null)
            .writable("_tagGroups", null)
            .writable("_tags", null)
            .writable("_tokenUser", null)
            .writable("_user", null)
            .readOnly("onCoreInfoOut");
    }

    private _onCoreInfoOut(data: Messages.Broadcast): void {
        this.client.emit("broadcast", data);
    }

    /** @internal */
    async _track(on: boolean): Promise<void> {
        const m = on ? "resourceOn" : "resourceOff";
        if (on) {
            if (this.client.anyTracked("awake")) this._awakeCharacters = await this.getAwakeCharacters();
            if (this.client.anyTracked("globalTeleports")) this._globalTeleports = await this.getGlobalTeleports();
            if (this.client.anyTracked("tagGroups")) this._tagGroups = await this.getTagGroups();
            if (this.client.anyTracked("globalTags")) this._tags = await this.getTags();
            if (this.client.anyTracked("broadcast")) this._coreInfo = await this.getCoreInfo();
        }

        if (this.client.anyTracked("awake") && this._awakeCharacters) {
            this._awakeCharacters.listeners.listenOrUnlisten(on, data => this.client.emit("awakeCharacters.add", data.item), data => this.client.emit("awakeCharacters.remove", data.item), kEvents);
        }
        if (this.client.anyTracked("globalTeleports") && this._globalTeleports) {
            this._globalTeleports.listeners.listenOrUnlisten(on, data => this.client.emit("globalTeleports.add", data.item), data => this.client.emit("globalTeleports.remove", data.item), kEvents);
        }
        if (this.client.anyTracked("tagGroups") && this._tagGroups) {
            this._tagGroups.listeners.listenOrUnlisten(on, data => this.client.emit("tagGroups.add", data.item), data => this.client.emit("tagGroups.remove", data.item), kEvents);
        }
        if (this.client.anyTracked("globalTags") && this._tags) {
            this._tags.listeners.listenOrUnlisten(on, data => this.client.emit("tags.add", data.item), data => this.client.emit("tags.remove", data.item), kEvents);
        }
        if (this.client.anyTracked("broadcast") && this._coreInfo) {
            this._coreInfo[m]("out", this.onCoreInfoOut);
        }

        if (!on) {
            this._awakeCharacters = null;
            this._botUser = null;
            this._globalTeleports = null;
            this._player = null;
            this._playerUser = null;
            this._tagGroups = null;
            this._tags = null;
            this._tokenUser = null;
            this._user = null;
        }
    }

    async getAwakeCharacters(): Promise<AwakeCharacters> {
        return this.client.api.get<AwakeCharacters>(ResourceIDs.AWAKE_CHARACTERS);
    }

    async getBotUser(): Promise<BotUser> {
        return (this._botUser ??= await this.client.api.call<BotUser>("core", "getBot"));
    }

    async getCoreInfo(): Promise<CoreInfo> {
        return this.client.api.get<CoreInfo>(ResourceIDs.CORE_INFO);
    }

    async getGlobalTeleports(): Promise<GlobalTeleports> {
        return this.client.api.get<GlobalTeleports>(ResourceIDs.NODES);
    }

    async getInfo(): Promise<Info> {
        return {
            core:      await this.getCoreInfo(),
            mail:      await this.getMailInfo(),
            note:      await this.getNoteInfo(),
            report:    await this.getReportInfo(),
            support:   await this.getSupportInfo(),
            tag:       await this.getTagInfo(),
            webClient: await this.getWebClientInfo()
        };
    }

    async getMailInfo(): Promise<MailInfo> {
        return this.client.api.get<MailInfo>(ResourceIDs.MAIL_INFO);
    }

    async getNoteInfo(): Promise<NoteInfo> {
        return this.client.api.get<NoteInfo>(ResourceIDs.NOTE_INFO);
    }

    async getPlayer(): Promise<Player> {
        return (this._player ??= await this.client.api.call<Player>("core", "getPlayer"));
    }

    /**
     * Get the authenticated user.
     * @returns The authenticated user.
     * @note This is an alias for {@link getUser} which throws if the result is not an instance of `User`.
     */
    async getPlayerUser(): Promise<User> {
        if (this._playerUser) return this._playerUser;
        const user = await this.getUser();
        if (!(user instanceof TokenUser)) return this._playerUser ??= user;
        throw new Error(`Expected to get User, got ${user.constructor.name}`);
    }

    async getReportInfo(): Promise<ReportInfo> {
        return this.client.api.get<ReportInfo>(ResourceIDs.REPORT_INFO);
    }

    async getRoles(): Promise<Record<"roles" | "idRoles", Array<string> | null>> {
        return this.client.api.call<Record<"roles" | "idRoles", Array<string> | null>>("core", "getRoles");
    }

    async getSupportInfo(): Promise<SupportInfo> {
        return this.client.api.get<SupportInfo>(ResourceIDs.SUPPORT_INFO);
    }

    async getTagGroups(): Promise<TagGroups> {
        return this.client.api.get<TagGroups>(ResourceIDs.TAG_GROUPS);
    }

    async getTagInfo(): Promise<TagInfo> {
        return this.client.api.get<TagInfo>(ResourceIDs.TAG_INFO);
    }

    async getTags(): Promise<Tags> {
        return this.client.api.get<Tags>(ResourceIDs.TAGS);
    }

    /**
     * Get the authenticated user.
     * @returns The authenticated user.
     * @note This is an alias for {@link getUser} which throws if the result is not an instance of `TokenUser`.
     */
    async getTokenUser(): Promise<TokenUser> {
        if (this._tokenUser) return this._tokenUser;
        const user = await this.getUser();
        if (user instanceof TokenUser) return this._tokenUser = user;
        throw new Error(`Expected to get TokenUser, got ${user.constructor.name}`);
    }

    /**
     * Get the authenticated user. For password authentication this will return {@link User}, for token authentication this will return {@link TokenUser}.
     * @returns The authenticated user.
     */
    async getUser(): Promise<User | TokenUser> {
        return (this._user ??= await this.client.api.call<User | TokenUser>("auth", "getUser"));
    }

    async getWebClientInfo(): Promise<WebClientInfo> {
        return this.client.api.get<WebClientInfo>(ResourceIDs.WEB_CLIENT_INFO);
    }
}
