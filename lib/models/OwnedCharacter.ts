import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { OwnedCharacterProperties } from "../generated/models/types.js";
import { OwnedCharacterDefinition } from "../generated/models/definitions.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import { Properties, type ResClient } from "resclient-ts";

declare interface OwnedCharacter extends BaseModel, OwnedCharacterProperties {}
// do not edit the first line of the class comment
/**
 * An owned character.
 * @resourceID {@link ResourceIDs.OWNED_CHARACTER | OWNED_CHARACTER}
 */
class OwnedCharacter extends BaseModel implements OwnedCharacterProperties {
    private onChange = this._onChange.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: OwnedCharacterDefinition });
        Properties.of(this)
            .readOnly("onChange");
    }

    // make sure to update trackChanges in _listen if anything changes here
    private _onChange(data: Partial<OwnedCharacterProperties>): void {
        if (this.client.anyTracked("roomChange") && data.inRoom !== undefined) {
            this.client.emit("roomChange", this, this.inRoom, data.inRoom);
        }
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        const trackChanges = this.client.anyTracked("roomChange");
        if (trackChanges) this[m]("change", this.onChange);
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }

    get fullname(): string {
        return `${this.name} ${this.surname}`.trim();
    }

    get isAwake(): boolean {
        return this.state === "awake";
    }

    get isControlled(): boolean {
        return this.getControlled() !== null || this.isControlledBot;
    }

    get isControlledBot(): boolean {
        return this.controller === "bot";
    }

    /**
     * Delete this character.
     * @param heir The ID of the character to inherit any rooms or items of the deleted character.
     * @playerRequired
     */
    async delete(heir: string): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.deleteChar(this.id, heir));
    }

    getControlled(): ControlledCharacter | null {
        return this.client.api.getCached<ControlledCharacter>(ResourceIDs.CONTROLLED_CHARACTER({ id: this.id }));
    }

    /**
     * Set character settings.
     * @note This requires player access (password authentication).
     * @param options The settings to apply.
     */
    async setSettings(options: Omit<Commands.Player.SetCharSettingsOptions, "puppeteerId">): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.setCharSettings(this.id, options));
    }

    /**
     * Wake up and control this character. This will not error if the character is already controlled or already awake.
     * @param hidden If the character should be hidden from the awake list. Only applicable to bots.
     * @param force Ignore already being controlled or woken up.
     * @returns The controlled character.
     */
    async wakeup(hidden?: boolean, force = true): Promise<ControlledCharacter> {
        return this.client.commands.core.getPlayer().then(player =>
            player.controlChar(this.id, force).then(ctrl => ((ctrl.wakeup(hidden, force), ctrl)))
        );
    }
}

export default OwnedCharacter;
