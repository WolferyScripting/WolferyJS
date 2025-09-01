import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type CharacterInfo from "./CharacterInfo.js";
import type Watch from "./Watch.js";
import type { TagPref } from "../util/types.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { CharacterProperties } from "../generated/models/types.js";
import { CharacterDefinition } from "../generated/models/definitions.js";
import { kCharacter, modelId } from "../util/Util.js";
import { type ResModelOptions , type ResClient, Properties } from "resclient-ts";

declare interface Character extends BaseModel, CharacterProperties {}
// do not edit the first line of the class comment
/**
 * A character
 * @resourceID {@link ResourceIDs.CHARACTER | CHARACTER}
 */
class Character extends BaseModel implements CharacterProperties {
    private _info!: CharacterInfo | null;
    private onChange = this._onChange.bind(this);
    private onInfoChange = this._onInfoChange.bind(this);
    // eslint-disable-next-line unicorn/no-object-as-default-parameter
    constructor(client: WolferyJS, api: ResClient, rid: string, options: ResModelOptions = { definition: CharacterDefinition }) {
        super(client, api, rid, options);
        Properties.of(this)
            .writable("_info", null)
            .readOnly("onChange")
            .readOnly("onInfoChange");
    }

    // make sure to update trackChanges in _listen if anything changes here
    private async _onChange(data: Partial<this>): Promise<void> {
        if (data.awake !== undefined && this.awake && this.client.anyTracked("charInfo") && this._info === null) {
            await this.getInfo().then(info => info.keep());
        }


        if (this.client.anyTracked("idle") && data.idle !== undefined) {
            this.client.emit("idleStatusChange", this, this.idle, data.idle);
        }

        if (this.client.anyTracked("lfrp") && data.rp !== undefined) {
            this.client.emit("lfrp.change", this, this.rp === "lfrp");
        }
    }

    private _onInfoChange(data: Partial<CharacterInfo>, info: CharacterInfo): void {
        if (this.client.anyTracked("lfrp") && data.lfrpDesc !== undefined) {
            this.client.emit("lfrp.descChange", this, info.lfrpDesc, data.lfrpDesc);
        }

        if (data.about !== undefined) {
            this.client.emit("aboutChange", this, info.about, data.about);
        }
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        // don't listen to changes if we aren't looking for anything
        const trackChanges = this.client.anyTracked("charInfo", "idle", "lfrp");
        const m = on ? "resourceOn" : "resourceOff";
        if (trackChanges) this[m]("change", this.onChange);
        if (on) {
            if (this.client.anyTracked("charInfo") && (this.awake || this.client.anyTracked("charInfoOffline"))) {
                this._info = await this.getInfo();
                this._info[m]("change", this.onInfoChange);
            }
        } else {
            this._info?.[m]("change", this.onInfoChange);
            this._info = null;
        }

        if (this.client.anyTracked("characterTags")) {
            this.listeners.addOrRemove(on, this.tags, data => this.client.emit("characterTags.add", this, data.item, data.key.slice(data.key.indexOf("_") + 1) as TagPref), data => this.client.emit("characterTags.remove", this, data.item, data.key.slice(data.key.indexOf("_") + 1) as TagPref), kCharacter(this.id));
        }
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
     * @calls {@link ControlledCommands.address}
     */
    async address(ctrl: string | ControlledCharacter, options: Commands.ControlledCharacter.AddressOptions): Promise<null> {
        return this.client.commands.controlled.address(ctrl, this.id, options);
    }

    /**
     * Request to follow this character.
     * @param ctrl The controlled character to follow this character.
     * @calls {@link ControlledCommands.follow}
     */
    async follow(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.follow(ctrl, this.id);
    }

    /**
     * Get the character info.
     * @calls {@link MiscCommands.getCharInfo}
     */
    async getInfo(): Promise<CharacterInfo> {
        return this.client.commands.misc.getCharInfo(this.id);
    }

    /**
     * Request to join this character.
     * @param ctrl The controlled character to join this character.
     * @calls {@link ControlledCommands.join}
     */
    async join(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.join(ctrl, this.id);
    }

    /**
     * Request to lead this character.
     * @param ctrl The controlled character to lead this character.
     * @calls {@link ControlledCommands.lead}
     */
    async lead(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.lead(ctrl, this.id);
    }

    /**
     * Look at this character.
     * @param ctrl The controlled character to look at this character.
     * @calls {@link ControlledCommands.look}
     */
    async look(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.look(ctrl, this.id);
    }

    /**
     * Send a mail to this character.
     * @param ctrl The controlled character to send the mail.
     * @param options The mail options.
     * @playerRequired
     * @calls {@link CoreCommands.getPlayer} > {@link Player.mail}
     */
    async mail(ctrl: string | ControlledCharacter, options: Commands.Inbox.SendOptions): Promise<Character> {
        return this.client.commands.core.getPlayer().then(player => player.mail(ctrl, this.id, options));
    }

    /**
     * Send a message to this character.
     * @param ctrl The controlled character to send the message.
     * @param options The options for sending the message.
     * @calls {@link ControlledCommands.message}
     */
    async message(ctrl: string | ControlledCharacter, options: Commands.ControlledCharacter.MessageOptions): Promise<null> {
        return this.client.commands.controlled.message(ctrl, this.id, options);
    }

    /**
     * Mute this character.
     * @playerRequired
     * @calls {@link CoreCommands.getPlayer} > {@link Player.muteChar}
     */
    async mute(): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.muteChar(this.id));
    }

    /**
     * Stop leading this character.
     * @param ctrl The controlled character to stop leading this character.
     * @calls {@link ControlledCommands.stopLead}
     */
    async stopLead(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.stopLead(ctrl, this.id);
    }

    /**
     * Request to summon this character.
     * @param ctrl The controlled character to summon this character.
     * @calls {@link ControlledCommands.summon}
     */
    async summon(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.summon(ctrl, this.id);
    }

    /**
     * Unlook at this character.
     * @note This will stop the controlled character looking at any character.
     * @param ctrl The controlled character to unlook at this character.
     * @calls {@link ControlledCommands.look}
     */
    async unlook(ctrl: string | ControlledCharacter): Promise<null> {
        return this.client.commands.controlled.look(ctrl, modelId(ctrl));
    }

    /**
     * Unmute this character.
     * @playerRequired
     * @calls {@link CoreCommands.getPlayer} > {@link Player.unmuteChar}
     */
    async unmute(): Promise<null> {
        return this.client.commands.core.getPlayer().then(player => player.unmuteChar(this.id));
    }

    /**
     * Remove this character from your watch list.
     * @playerRequired
     * @calls {@link CoreCommands.getPlayer} > {@link Player.unwatchChar}
     */
    async unwatch(): Promise<Character> {
        return this.client.commands.core.getPlayer().then(player => player.unwatchChar(this.id));
    }

    /**
     * Add this character to your watch list.
     * @playerRequired
     * @calls {@link CoreCommands.getPlayer} > {@link Player.watchChar}
     */
    async watch(): Promise<Watch> {
        return this.client.commands.core.getPlayer().then(player => player.watchChar(this.id));
    }

    /**
     * Send a whisper to this character. You must be in the same room.
     * @param ctrl The controlled character to send the whisper.
     * @param options The options for the whisper.
     * @calls {@link ControlledCommands.whisper}
     */
    async whisper(ctrl: string | ControlledCharacter, options: Commands.ControlledCharacter.WhisperOptions): Promise<null> {
        return this.client.commands.controlled.whisper(ctrl, this.id, options);
    }
}

export default Character;
