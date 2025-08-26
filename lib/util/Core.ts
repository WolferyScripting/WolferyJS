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
import type WolferyJS from "../WolferyJS.js";
import { Properties } from "resclient-ts";

export interface Info {
    core: CoreInfo;
    mail: MailInfo;
    note: NoteInfo;
    report: ReportInfo;
    support: SupportInfo;
    tag: TagInfo;
    webClient: WebClientInfo;
}

/** Core classes/calls that don't require any id input */
export default class Core {
    client!: WolferyJS;
    constructor(client: WolferyJS) {
        Properties.of(this).readOnly("client", client);
    }

    async getAwakeCharacters(): Promise<AwakeCharacters> {
        return this.client.api.get<AwakeCharacters>(ResourceIDs.AWAKE_CHARACTERS);
    }

    async getBotUser(): Promise<BotUser> {
        return this.client.api.call<BotUser>("core", "getBot");
    }

    async getCoreInfo(): Promise<CoreInfo> {
        return this.client.api.get<CoreInfo>(ResourceIDs.CORE_INFO);
    }

    /**
     * Get the authenticated user.
     * @returns The authenticated user.
     * @note This is an alias for {@link getUser} which throws if the result is not an instance of `User`.
     */
    async getFullUser(): Promise<User> {
        const user = await this.getUser();
        if (!(user instanceof TokenUser)) return user;
        throw new Error(`Expected to get User, got ${user.constructor.name}`);
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
        return this.client.api.call<Player>("core", "getPlayer");
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
        const user = await this.getUser();
        if (user instanceof TokenUser) return user;
        throw new Error(`Expected to get TokenUser, got ${user.constructor.name}`);
    }

    /**
     * Get the authenticated user. For password authentication this will return {@link User}, for token authentication this will return {@link TokenUser}.
     * @returns The authenticated user.
     */
    async getUser(): Promise<User | TokenUser> {
        return this.client.api.call<User | TokenUser>("auth", "getUser");
    }

    async getWebClientInfo(): Promise<WebClientInfo> {
        return this.client.api.get<WebClientInfo>(ResourceIDs.WEB_CLIENT_INFO);
    }
}
