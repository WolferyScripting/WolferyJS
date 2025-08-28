import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type CharacterInfo from "./CharacterInfo.js";
import { type TagPref } from "./CharacterTags.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { CharacterProperties } from "../generated/models/types.js";
import { CharacterDefinition } from "../generated/models/definitions.js";
import { kCharacter } from "../util/Util.js";
import type { ResModelOptions , ResClient } from "resclient-ts";

declare interface Character extends BaseModel, CharacterProperties {}
// do not edit the first line of the class comment
/**
 * A character
 * @resourceID {@link ResourceIDs.CHARACTER | CHARACTER}
 */
class Character extends BaseModel implements CharacterProperties {
    private _info!: CharacterInfo | null;
    private onChange = this._onChange.bind(this);
    // eslint-disable-next-line unicorn/no-object-as-default-parameter
    constructor(client: WolferyJS, api: ResClient, rid: string, options: ResModelOptions = { definition: CharacterDefinition }) {
        super(client, api, rid, options);
        this.p.define("_info", true, false, false, null);
    }

    private async _onChange(data: Partial<this>): Promise<void> {
        if (data.awake !== undefined && this.awake !== data.awake && this.awake && this.client.options.track.charInfo && this._info === null) {
            await this.getInfo().then(info => info.keep());
        }


        if (data.idle !== undefined && this.idle !== data.idle) {
            this.client.emit("idleStatusChange", this, this.idle, data.idle);
        }
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("change", this.onChange);
        if (on) {
            if (this.client.options.track.charInfo && (this.awake || this.client.options.track.charInfoOffline)) {
                this._info = await this.getInfo();
                this._info.keep();
            }
        } else {
            this._info?.unkeep();
            this._info = null;
        }

        this.listeners.addOrRemove(on, this.tags, data => this.client.emit("characterTags.add", this, data.item, data.key.slice(data.key.indexOf("_") + 1) as TagPref), data => this.client.emit("characterTags.remove", this, data.item, data.key.slice(data.key.indexOf("_") + 1) as TagPref), kCharacter(this.id));
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }

    get fullname(): string {
        return `${this.name} ${this.surname}`.trim();
    }

    get info(): CharacterInfo | null {
        return this._info;
    }

    /**
     * Address this character.
     * @param ctrl The controlled character to address this character.
     * @param options The options for addressing the character.
     */
    async address(ctrl: ControlledCharacter, options: Commands.ControlledCharacter.AddressOptions): Promise<null> {
        return ctrl.address(this.id, options);
    }

    /**
     * Request to follow this character.
     * @param ctrl The controlled character to follow this character.
     */
    async follow(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.follow(this.id);
    }

    async getInfo(): Promise<CharacterInfo> {
        return this.api.get<CharacterInfo>(ResourceIDs.CHARACTER_INFO({ id: this.id }));
    }

    /**
     * Request to join this character.
     * @param ctrl The controlled character to join this character.
     */
    async join(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.join(this.id);
    }

    /**
     * Request to lead this character.
     * @param ctrl The controlled character to lead this character.
     */
    async lead(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.lead(this.id);
    }

    /**
     * Look at this character.
     * @param ctrl The controlled character to look at this character.
     */
    async look(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.look(this.id);
    }

    /**
     * Send a mail to this character.
     * @param ctrl The controlled character to send the mail.
     * @param options The mail options.
     */
    async mail(ctrl: ControlledCharacter, options: Commands.Inbox.SendOptions): Promise<Character> {
        return ctrl.mail(this.id, options);
    }

    /**
     * Send a message to this character.
     * @param ctrl The controlled character to send the message.
     * @param options The options for sending the message.
     */
    async message(ctrl: ControlledCharacter, options: Commands.ControlledCharacter.MessageOptions): Promise<null> {
        return ctrl.message(this.id, options);
    }

    /** Mute this character. */
    async mute(): Promise<null> {
        return this.client.modules.core.getPlayer().then(player => player.muteChar(this.id));
    }

    /**
     * Stop leading this character.
     * @param ctrl The controlled character to stop leading this character.
     */
    async stopLead(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.stopLead(this.id);
    }

    /**
     * Request to summon this character.
     * @param ctrl The controlled character to summon this character.
     */
    async summon(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.summon(this.id);
    }

    /**
     * Unlook at this character.
     * @note This will stop the controlled character looking at any character.
     * @param ctrl The controlled character to unlook at this character.
     */
    async unlook(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.unlook();
    }

    /** Unmute this character. */
    async unmute(): Promise<null> {
        return this.client.modules.core.getPlayer().then(player => player.unmuteChar(this.id));
    }

    /** Remove this character from your watch list. */
    async unwatch(): Promise<Character> {
        return this.client.modules.core.getPlayer().then(player => player.unwatchChar(this.id));
    }

    /** Add this character to your watch list. */
    async watch(): Promise<Character> {
        return this.client.modules.core.getPlayer().then(player => player.watchChar(this.id));
    }

    /**
     * Send a whisper to this character. You must be in the same room.
     * @param ctrl The controlled character to send the whisper.
     * @param options The options for the whisper.
     */
    async whisper(ctrl: ControlledCharacter, options: Commands.ControlledCharacter.WhisperOptions): Promise<null> {
        return ctrl.whisper(this.id, options);
    }
}

export default Character;
