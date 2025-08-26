import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { OwnedCharacterProperties } from "../generated/models/types.js";
import { OwnedCharacterDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface OwnedCharacter extends BaseModel, OwnedCharacterProperties {}
// do not edit the first line of the class comment
/**
 * An owned character.
 */
class OwnedCharacter extends BaseModel implements OwnedCharacterProperties {
    private onChange = this._onChange.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: OwnedCharacterDefinition });
        this.p.writable("inRoomWas");
    }

    private _onChange(data: Partial<OwnedCharacterProperties>): void {
        if (data.inRoom !== undefined) {
            this.client.emit("roomChange", this, this.inRoom, data.inRoom);
        }
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("change", this.onChange);
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }

    get fullname(): string {
        return `${this.name} ${this.surname}`.trim();
    }

    /**
     * Set character settings.
     * @note This requires player access (password authentication).
     * @param options The settings to apply.
     */
    async setSettings(options: Omit<Commands.Player.SetCharSettingsOptions, "puppeteerId">): Promise<null> {
        return this.client.getPlayer().then(player => player.setCharSettings(this.id, options));
    }

    /**
     * Wake up and control this character. This will not error if the character is already controlled or already awake.
     * @param hidden If the character should be hidden from the awake list. Only applicable to bots.
     * @returns The controlled character.
     */
    async wakeup(hidden?: boolean): Promise<ControlledCharacter> {
        return this.client.getPlayer().then(player =>
            player.controlChar(this.id, true).then(ctrl => ((ctrl.wakeup(hidden, true), ctrl)))
        );
    }
}

export default OwnedCharacter;
