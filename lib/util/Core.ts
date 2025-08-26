import type GlobalTeleports from "../collections/GlobalTeleports.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type AwakeCharacters from "../models/AwakeCharacters.js";
import type CoreInfo from "../models/CoreInfo.js";
import type MailInfo from "../models/MailInfo.js";
import type NoteInfo from "../models/NoteInfo.js";
import type Player from "../models/Player.js";
import type ReportInfo from "../models/ReportInfo.js";
import type SupportInfo from "../models/SupportInfo.js";
import type TagGroups from "../models/TagGroups.js";
import type TagInfo from "../models/TagInfo.js";
import type Tags from "../models/Tags.js";
import type WebClientInfo from "../models/WebClientInfo.js";
import type WolferyJS from "../WolferyJS.js";
import { Properties } from "resclient-ts";

// Core classes/calls that don't require any id input
export default class Core {
    client!: WolferyJS;
    constructor(client: WolferyJS) {
        Properties.of(this).readOnly("client", client);
    }

    async getAwakeCharacters(): Promise<AwakeCharacters> {
        return this.client.api.get<AwakeCharacters>(ResourceIDs.AWAKE_CHARACTERS);
    }

    async getCoreInfo(): Promise<CoreInfo> {
        return this.client.api.get<CoreInfo>(ResourceIDs.CORE_INFO);
    }

    async getGlobalTeleports(): Promise<GlobalTeleports> {
        return this.client.api.get<GlobalTeleports>(ResourceIDs.NODES);
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

    async getWebClientInfo(): Promise<WebClientInfo> {
        return this.client.api.get<WebClientInfo>(ResourceIDs.WEB_CLIENT_INFO);
    }
}
