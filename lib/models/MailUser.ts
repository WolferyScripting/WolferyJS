import NonResModel from "./NonResModel.js";
import Definition from "../util/Definition.js";
import type WolferyJS from "../WolferyJS.js";
import type { ResClient } from "resclient-ts";

const DEFINITION = Definition.new()
    .add("avatar", "string")
    .add("id", "string")
    .add("name", "string")
    .add("surname", "string")
    .add<"type", "string", "char">("type", "string");
export type MailUserProperties = (typeof DEFINITION)["type"];

declare interface MailUser extends NonResModel, MailUserProperties {}
class MailUser extends NonResModel implements MailUserProperties {
    constructor(client: WolferyJS, api: ResClient, data: MailUserProperties) {
        super(client, api, data, { definition: DEFINITION.get() });
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }
}

export default MailUser;
