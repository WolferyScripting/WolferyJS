import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { BotUserProperties } from "../generated/models/types.js";
import { BotUserDefinition } from "../generated/models/definitions.js";
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

    get id(): string {
        return this.char.id;
    }

    /**
     * Control the character associated with this BotUser.
     * @returns The owned character instance associated with this BotUser.
     */
    async controlChar(): Promise<ControlledCharacter> {
        return this.call<ControlledCharacter>("controlChar");
    }

    async release(): Promise<ControlledCharacter | null> {
        if (this.controlled === null) return null;
        return this.controlled.release();
    }

    /**
     * Wake up the character associated with this BotUser.
     * @param hidden If the character should be hidden from the awake list.
     */
    async wakeup(hidden?: boolean): Promise<ControlledCharacter> {
        if (this.controlled !== null) {
            if (this.controlled.state === "awake") {
                return this.controlled;
            }
            await this.controlled.wakeup(hidden);
            return this.controlled;
        }
        return this.controlChar()
            .then(char => char.wakeup(hidden).then(() => char));
    }
}

export default BotUser;
