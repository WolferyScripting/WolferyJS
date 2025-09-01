import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { BotUserProperties } from "../generated/models/types.js";
import { BotUserDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { ResClient } from "resclient-ts";

declare interface BotUser extends BaseModel, BotUserProperties {}
// do not edit the first line of the class comment
/**
 * The user when logged in with a bot token.
 * @resourceID {@link ResourceIDs.BOT_USER | BOT_USER}
 */
class BotUser extends BaseModel {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: BotUserDefinition });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("unsubscribe", this.client.onUnsubscribe);
    }

    /** The character id. */
    get charId(): string {
        return this.char.id;
    }

    /** The user id. */
    get id(): string {
        return ResourceIDs.BOT_USER.parts(this.rid).id;
    }

    /**
     * Control the character associated with this BotUser.
     * @param force Ignore the character already being controlled.
     * @calls {@link MiscCommands.controlCharBot}
     */
    async controlChar(force = true): Promise<ControlledCharacter> {
        if (force && this.controlled !== null) return this.controlled;
        return this.client.commands.misc.controlCharBot(this);
    }

    /**
     * Release control of the character associated with this BotUser.
     * @calls {@link ControlledCharacter.release}
     */
    async release(): Promise<ControlledCharacter | null> {
        if (this.controlled === null) return null;
        return this.controlled.release();
    }

    /**
     * Wake up the character associated with this BotUser.
     * @param hidden If the character should be hidden from the awake list.
     * @param force Ignore the character already being awake.
     * @calls {@link ControlledCharacter.wakeup}, {@link controlChar} > {@link ControlledCharacter.wakeup}
     */
    async wakeup(hidden?: boolean, force = true): Promise<ControlledCharacter> {
        if (this.controlled !== null) {
            if (this.controlled.state === "awake" && force) {
                return this.controlled;
            }
            await this.controlled.wakeup(hidden, force);
            return this.controlled;
        }
        return this.controlChar(force)
            .then(char => char.wakeup(hidden, force).then(() => char));
    }
}

export default BotUser;
