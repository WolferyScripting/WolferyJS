import NonResModel from "./NonResModel.js";
import type WolferyJS from "../WolferyJS.js";
import { MailUserDefinition } from "../generated/models/definitions.js";
import type { MailUserProperties } from "../generated/models/types.js";
import type { AnyObject, ResClient } from "resclient-ts";


declare interface MailUser extends NonResModel, MailUserProperties {}
// do not edit the first line of the class comment
/**
 * A mail user, seen in a {@link PlayerMailMessage}.
 * This is not a real RES model. It has been made into a model for convinience.
 */
class MailUser extends NonResModel implements MailUserProperties {
    constructor(client: WolferyJS, api: ResClient, data: MailUserProperties) {
        super(client, api, data as unknown as AnyObject, { definition: MailUserDefinition });
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }
}

export default MailUser;
