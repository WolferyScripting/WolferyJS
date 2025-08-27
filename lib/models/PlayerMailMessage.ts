import BaseModel from "./BaseModel.js";
import MailUser from "./MailUser.js";
import type WolferyJS from "../WolferyJS.js";
import type { MailUserProperties, PlayerMailMessageProperties } from "../generated/models/types.js";
import { PlayerMailMessageDefinition } from "../generated/models/definitions.js";
import type { AnyObject, ResClient } from "resclient-ts";

declare interface PlayerMailMessage extends BaseModel, PlayerMailMessageProperties {}
// do not edit the first line of the class comment
/**
 * A mail message.
 * @resourceID {@link ResourceIDs.PLAYER_MAIL_MESSAGE | PLAYER_MAIL_MESSAGE}
 */
class PlayerMailMessage extends BaseModel implements PlayerMailMessageProperties {
    from!: MailUser;
    to!: MailUser;
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: PlayerMailMessageDefinition });
    }

    /** Delete this message. */
    async delete(): Promise<null> {
        return this.call<null>("delete");
    }

    override update(props: AnyObject, reset?: boolean): AnyObject | null {
        const changed = super.update(props, reset);
        if ("from" in props) {
            this.from = new MailUser(this.client, this.api, props.from as MailUserProperties);
        }
        if ("to" in props) {
            this.to = new MailUser(this.client, this.api, props.to as MailUserProperties);
        }

        return changed;
    }
}

export default PlayerMailMessage;
