import type ControlledCharacter from "./ControlledCharacter.js";
import type Character from "./Character.js";
import type Note from "./Note.js";
import BaseModel from "./BaseModel.js";
import type Watches from "./Watches.js";
import type Notes from "./Notes.js";
import type UnreadMail from "./UnreadMail.js";
import type Bots from "./Bots.js";
import type Request from "./Request.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { BasicCharacterResponse, LookupCharacter, OptionalBasicCharacterResponse } from "../util/types.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type Inbox from "../collections/Inbox.js";
import type { PlayerProperties } from "../generated/models/types.js";
import { PlayerDefinition } from "../generated/models/definitions.js";
import type IncomingRequests from "../collections/IncomingRequests.js";
import type OutgoingRequests from "../collections/OutgoingRequests.js";
import { kPlayer } from "../util/Util.js";
import type Tokens from "../collections/Tokens.js";
import type AuthNotices from "../collections/AuthNotices.js";
import type IdentityNotices from "../collections/IdentityNotices.js";
import { Properties, type ResClient } from "resclient-ts";

declare interface Player extends BaseModel, PlayerProperties {}
// do not edit the first line of the class comment
/**
 * The logged in player.
 * @resourceID {@link ResourceIDs.PLAYER | PLAYER}
 */
class Player extends BaseModel implements PlayerProperties {
    private _authNotices!: AuthNotices | null;
    private _bots!: Bots | null;
    private _identityNotices!: IdentityNotices | null;
    private _inbox!: Inbox | null;
    private _incomingRequests!: IncomingRequests | null;
    private _notes!: Notes | null;
    private _outgoingRequests!: OutgoingRequests | null;
    private _tokens!: Tokens | null;
    private _unreadMail!: UnreadMail | null;
    private _watches!: Watches | null;
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: PlayerDefinition });
        Properties.of(this)
            .writable("_authNotices", null)
            .writable("_bots", null)
            .writable("_identityNotices", null)
            .writable("_inbox", null)
            .writable("_incomingRequests", null)
            .writable("_notes", null)
            .writable("_outgoingRequests", null)
            .writable("_tokens", null)
            .writable("_unreadMail", null)
            .writable("_watches", null);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("unsubscribe", this.client.onUnsubscribe);
        if (on) {
            if (this.client.anyTracked("notices")) {
                this._authNotices = await this.getAuthNotices();
                this._identityNotices = await this.getIdentityNotices();
            }
            if (this.client.anyTracked("bots")) this._bots = await this.getBots();
            if (this.client.anyTracked("mail")) {
                this._inbox = await this.getInbox();
                this._unreadMail = await this.getUnreadMail();
            }
            if (this.client.anyTracked("notes")) this._notes = await this.getNotes();
            if (this.client.anyTracked("incomingRequests")) this._incomingRequests = await this.getIncomingRequests();
            if (this.client.anyTracked("outgoingRequests")) this._outgoingRequests = await this.getOutgoingRequests();
            if (this.client.anyTracked("tokens")) this._tokens = await this.getTokens();
            if (this.client.anyTracked("watches")) this._watches = await this.getWatches();
        } else {
            if (this._notes) {
                for (const ref of this._notes.list) {
                    const note = ref.getCached();
                    if (note) this._listenNote(note, false);
                }
            }
            if (this._incomingRequests) {
                for (const request of this._incomingRequests.list) {
                    this._listenRequest(request, true, false);
                }
            }
            if (this._outgoingRequests) {
                for (const request of this._outgoingRequests.list) {
                    this._listenRequest(request, false, false);
                }
            }
        }

        if (this.client.anyTracked("puppets")) {
            this.listeners.addOrRemove(on, this.puppets, data => this.client.emit("puppets.add", this, data.item), data => this.client.emit("puppets.remove", this, data.item), kPlayer(this.id));
        }
        if (this.client.anyTracked("ownedCharacters")) {
            this.listeners.addOrRemove(on, this.chars, data => this.client.emit("ownedCharacters.add", this, data.item), data => this.client.emit("ownedCharacters.remove", this, data.item), kPlayer(this.id));
        }
        if (this.client.anyTracked("controlledCharacters")) {
            this.listeners.addOrRemove(on, this.controlled, data => this.client.emit("controlledCharacters.add", this, data.item), data => this.client.emit("controlledCharacters.remove", this, data.item), kPlayer(this.id));
        }
        if (this.client.anyTracked("mutedCharacters")) {
            this.listeners.addOrRemove(on, this.mutedChars, data => this.client.emit("mutedCharacters.add", this, data.item), data => this.client.emit("mutedCharacters.remove", this, data.item), kPlayer(this.id));
        }
        if (this.client.anyTracked("notices")) {
            if (this._authNotices) {
                this.listeners.addOrRemove(on, this._authNotices, data => this.client.emit("notices.auth.add", this, data.item), data => this.client.emit("notices.auth.remove", this, data.item), kPlayer(this.id));
            }
            if (this._identityNotices) {
                this.listeners.addOrRemove(on, this._identityNotices, data => this.client.emit("notices.identity.add", this, data.item), data => this.client.emit("notices.identity.remove", this, data.item), kPlayer(this.id));
            }
        }
        if (this.client.anyTracked("bots") && this._bots) {
            this.listeners.addOrRemove(on, this._bots, data => this.client.emit("bots.add", this, data.item), data => this.client.emit("bots.remove", this, data.item), kPlayer(this.id));
        }
        if (this.client.anyTracked("mail")) {
            if (this._unreadMail) {
                this.listeners.addOrRemove(on, this._unreadMail, async data => {
                    const mail = await data.item.get();
                    this.client.emit("unreadMail.add", this, mail);
                }, async data => {
                    const mail = await data.item.get();
                    this.client.emit("unreadMail.remove", this, mail);
                }, kPlayer(this.id));
            }
            if (this._inbox) {
                this.listeners.addOrRemove(on, this._inbox, data => this.client.emit("inbox.add", this, data.item), data => this.client.emit("inbox.remove", this, data.item), kPlayer(this.id));
            }
        }
        if (this.client.anyTracked("incomingRequests") && this._incomingRequests) {
            this.listeners.addOrRemove(on, this._incomingRequests, data => {
                this._listenRequest(data.item, true, true);
                this.client.emit("requests.incoming.add", this, data.item);
            }, data => {
                this._listenRequest(data.item, true, false);
                this.client.emit("requests.incoming.remove", this, data.item);
            }, kPlayer(this.id));
        }
        if (this.client.anyTracked("notes") && this._notes) {
            this.listeners.addOrRemove(on, this._notes, async data => {
                const note = await data.item.get();
                if (this.client.anyTracked("noteChanges")) this._listenNote(note, true);
                const char = await note.char.get();
                this.client.emit("notes.add", this, note, char);
            }, async data => {
                const note = await data.item.get();
                if (this.client.anyTracked("noteChanges")) this._listenNote(note, false);
                const char = await note.char.get();
                this.client.emit("notes.remove", this, note, char);
            }, kPlayer(this.id));
        }
        if (this.client.anyTracked("outgoingRequests") && this._outgoingRequests) {
            this.listeners.addOrRemove(on, this._outgoingRequests, data => {
                this._listenRequest(data.item, false, true);
                this.client.emit("requests.outgoing.add", this, data.item);
            }, data => {
                this._listenRequest(data.item, false, false);
                this.client.emit("requests.outgoing.remove", this, data.item);
            }, kPlayer(this.id));
        }
        if (this.client.anyTracked("tokens") && this._tokens) {
            this.listeners.addOrRemove(on, this._tokens, data => this.client.emit("tokens.add", this, data.item), data => this.client.emit("tokens.remove", this, data.item), kPlayer(this.id));
        }
        if (this.client.anyTracked("watches") && this._watches) {
            this.listeners.addOrRemove(on, this._watches, async data => {
                const watch = await data.item.get();
                this.client.emit("watches.add", this, watch);
            }, async data => {
                const watch = await data.item.get();
                this.client.emit("watches.remove", this, watch);
            }, kPlayer(this.id));
        }

        if (!on) {
            this._authNotices = null;
            this._bots = null;
            this._identityNotices = null;
            this._inbox = null;
            this._incomingRequests = null;
            this._notes = null;
            this._outgoingRequests = null;
            this._tokens = null;
            this._unreadMail = null;
            this._watches = null;
        }
    }

    protected _listenNote(listenNote: Note, on: boolean): void {
        if (on) {
            const listener = (note: Note, char: Character, text: string, oldText: string): void => {
                this.client.emit("notes.textChange", this, note, char, text, oldText);
            };

            listenNote.setOnTextChange(listener);
        } else {
            listenNote.setOnTextChange(null);
        }
    }

    protected _listenRequest(listenRequest: Request, incoming: boolean, on: boolean): void {
        if (on) {
            const listener = (request: Request): void => {
                if (request.state === "pending") return;
                this.client.emit(`requests.${incoming ? "incoming" : "outgoing"}.${request.state}`, this, request);
            };
            listenRequest.setOnStateChange(listener);
        } else {
            listenRequest.setOnStateChange(null);
        }
    }

    /**
     * Accept a request.
     * @param requestId The ID of the request to accept.
     */
    async acceptRequest(requestId: string): Promise<null> {
        return this.call<null>("acceptRequest", { requestId });
    }

    /**
     * Append to the note for a character. The text will be added on a new line.
     * @param charId The ID of the character to append the note for.
     * @param text The text to append to the note.
     * @returns The character.
     */
    async appendNote(charId: string, text: string): Promise<Character> {
        return this.api.call<BasicCharacterResponse<"char">>(ResourceIDs.NOTE({ player: this.id, char: charId }), "append", { text })
            .then(r => this.basicChar(r, "char"));
    }

    /**
     * @private
     * @internal
     */
    async basicChar<K extends string>(data: BasicCharacterResponse<K>, key: K): Promise<Character>;
    async basicChar<K extends string>(data: BasicCharacterResponse<K> | OptionalBasicCharacterResponse<K> | null | undefined, key: K): Promise<Character | null>;
    async basicChar<K extends string>(data: BasicCharacterResponse<K> | OptionalBasicCharacterResponse<K> | null | undefined, key: K): Promise<Character | null> {
        if (!data || !data[key]) return null;
        return this.getChar(data[key].id);
    }

    /**
     * Control a character.
     * @param charId The ID of the character to control.
     * @param force Ignore if the character is already controlled.
     * @returns The controlled character.
     */
    async controlChar(charId: string, force = false): Promise<ControlledCharacter> {
        if (force && this.controlled.list.some(c => c.id === charId)) {
            return this.controlled.get(charId)!;
        }
        return this.call<ControlledCharacter>("controlChar", { charId });
    }

    /**
     * Control a puppet.
     * @param charId The ID of the character to control.
     * @param puppetId The ID of the puppet to control.
     * @param force Ignore if the puppet is already controlled.
     * @returns The controlled puppet.
     */
    async controlPuppet(charId: string, puppetId: string, force = false): Promise<ControlledCharacter> {
        if (force && this.controlled.list.some(p => p.id === puppetId && p.type === "puppet")) {
            return this.controlled.get(puppetId)!;
        }
        return this.call<ControlledCharacter>("controlPuppet", { charId, puppetId });
    }

    /**
     * Delete a character.
     * @param charId The ID of the character to delete.
     * @param heir The ID of the character to inherit any rooms or items of the deleted character.
     */
    async deleteChar(charId: string, heir: string): Promise<null> {
        return this.call<null>("deleteChar", { charId, heir });
    }

    /**
     * Focus a character.
     * @param charId The ID of the character to focus.
     * @param options The options for focusing the character.
     * @returns The focused character.
     */
    async focusChar(charId: string, options: Commands.Player.FocusCharOptions): Promise<Character> {
        return this.call<BasicCharacterResponse<"char">>("focusChar", { charId, ...options })
            .then(r => this.basicChar(r, "char"));
    }

    /** Get the auth notices for the player. */
    async getAuthNotices(): Promise<AuthNotices> {
        return this.api.get<AuthNotices>(ResourceIDs.AUTH_NOTICES({ id: this.id }));
    }

    /**
     * Get the bots for the player.
     * @returns The bots for the player.
     */
    async getBots(): Promise<Bots> {
        return this.api.get<Bots>(ResourceIDs.BOTS({ id: this.id }));
    }

    /**
     * Get a character.
     * @note This will return a cached value if available.
     * @param charId The ID of the character to get.
     * @returns The character.
     */
    async getChar(charId: string): Promise<Character> {
        const rid = ResourceIDs.CHARACTER({ id: charId });
        const cached = this.api.getCached<Character>(rid);
        if (cached) return cached;
        return this.call<Character>("getChar", { charId });
    }

    /**
     * Get the identity notices for the player.
     * @returns The identity notices for the player.
     */
    async getIdentityNotices(): Promise<IdentityNotices> {
        return this.api.get<IdentityNotices>(ResourceIDs.IDENTITY_NOTICES({ id: this.id }));
    }

    /**
     * Get the inbox for the player.
     * @returns The inbox for the player.
     */
    async getInbox(): Promise<Inbox> {
        return this.api.get<Inbox>(ResourceIDs.INBOX({ id: this.id }));
    }

    /**
     * Get the incoming requests.
     */
    async getIncomingRequests(): Promise<IncomingRequests> {
        return this.api.get<IncomingRequests>(ResourceIDs.INCOMING_REQUESTS({ id: this.id }));
    }

    /**
     * Get the note for a character.
     * @param charId The ID of the character to get the note for.
     * @returns The note for the character.
     */
    async getNote(charId: string): Promise<Note> {
        return this.api.get<Note>(ResourceIDs.NOTE({ player: this.id, char: charId }));
    }

    /**
     * Get the notes for characters.
     */
    async getNotes(): Promise<Notes> {
        return this.api.get<Notes>(ResourceIDs.NOTES({ id: this.id }));
    }

    /**
     * Get the outgoing requests.
     */
    async getOutgoingRequests(): Promise<OutgoingRequests> {
        return this.api.get<OutgoingRequests>(ResourceIDs.OUTGOING_REQUESTS({ id: this.id }));
    }

    /**
     * Get the management tokens for the player.
     * @returns The management tokens for the player.
     */
    async getTokens(): Promise<Tokens> {
        return this.api.get<Tokens>(ResourceIDs.TOKENS({ id: this.id }));
    }

    /**
     * Get the unread mail for the player.
     */
    async getUnreadMail(): Promise<UnreadMail> {
        return this.api.get<UnreadMail>(ResourceIDs.UNREAD_MAIL({ id: this.id }));
    }

    /**
     * Get the characters being watched.
     */
    async getWatches(): Promise<Watches> {
        return this.api.get<Watches>(ResourceIDs.WATCHES({ id: this.id }));
    }

    /**
     * Lookup characters by name.
     * @param name The name to lookup.
     * @returns An array of matching characters.
     */
    async lookupChars(name: string): Promise<Array<LookupCharacter>> {
        return this.call<Record<"chars", Array<LookupCharacter>>>("lookupChars", { name, extended: true })
            .then(r => r.chars);
    }

    /**
     * Mute a character.
     * @param charId The ID of the character to mute.
     */
    async muteChar(charId: string): Promise<null> {
        return this.muteChars({ [charId]: true });
    }

    /**
     * Manage muted characters. Set an id to true to mute, false to unmute.
     * @param chars
     */
    async muteChars(chars: Record<string, boolean>): Promise<null> {
        return this.call<Record<string, boolean>>("muteChars", { chars }).then(() => null);
    }

    /**
     * Reject a request.
     * @param requestId The ID of the request to reject.
     */
    async rejectRequest(requestId: string): Promise<null> {
        return this.call<null>("rejectRequest", { requestId });
    }

    /**
     * Revoke a request.
     * @param requestId The ID of the request to revoke.
     */
    async revokeRequest(requestId: string): Promise<null> {
        return this.call<null>("revokeRequest", { requestId });
    }

    /**
     * Set character settings.
     * @note This requires player access (password authentication).
     * @param charId The ID of the character to set the settings for.
     * @param options The settings to apply.
     */
    async setCharSettings(charId: string, options: Commands.Player.SetCharSettingsOptions): Promise<null> {
        return this.call<null>("setCharSettings", { charId, ...options });
    }

    /**
     * Set the note for a character.
     * @param charId The ID of the character to set the note for.
     * @param text The text to set the note to. Provide an empty string to clear.
     * @returns null if cleared
     */
    async setNote(charId: string, text: string): Promise<Character | null> {
        return this.api.call<BasicCharacterResponse<"char"> | null>(ResourceIDs.NOTE({ player: this.id, char: charId }), "set", { text })
            .then(r => this.basicChar(r, "char"));
    }

    /**
     * Unmute a character.
     * @param charId The ID of the character to unmute.
     */
    async unmuteChar(charId: string): Promise<null> {
        return this.muteChars({ [charId]: false });
    }

    /**
     * Remove a character from your watch list.
     * @param charId The ID of the character to unwatch.
     */
    async unwatchChar(charId: string): Promise<Character> {
        return this.api.call<BasicCharacterResponse<"char">>(ResourceIDs.WATCH({ player: this.id, char: charId }), "delete")
            .then(r => this.basicChar(r, "char"));
    }

    /**
     * Add a character to your watch list.
     * @param charId The ID of the character to watch.
     */
    async watchChar(charId: string): Promise<Character> {
        return this.api.call<BasicCharacterResponse<"char">>(ResourceIDs.WATCH({ player: this.id, char: charId }), "addWatcher", { charId })
            .then(r => this.basicChar(r, "char"));
    }
}

export default Player;
