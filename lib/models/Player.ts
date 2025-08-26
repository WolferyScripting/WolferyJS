import type ControlledCharacter from "./ControlledCharacter.js";
import type Character from "./Character.js";
import type Note from "./Note.js";
import BaseModel from "./BaseModel.js";
import type Watches from "./Watches.js";
import type Notes from "./Notes.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { BasicCharacterResponse, LookupCharacter } from "../util/types.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type Inbox from "../collections/Inbox.js";
import type { PlayerProperties } from "../generated/models/types.js";
import { PlayerDefinition } from "../generated/models/definitions.js";
import type IncomingRequests from "../collections/IncomingRequests.js";
import type OutgoingRequests from "../collections/OutgoingRequests.js";
import type { ResClient } from "resclient-ts";

declare interface Player extends BaseModel, PlayerProperties {}
// do not edit the first line of the class comment
/**
 * The logged in player.
 */
class Player extends BaseModel implements PlayerProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: PlayerDefinition });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("unsubscribe", this.client.onUnsubscribe);
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
    async basicChar<K extends string>(data: BasicCharacterResponse<K> | null, key: K): Promise<Character | null>;
    async basicChar<K extends string>(data: BasicCharacterResponse<K> | null, key: K): Promise<Character | null> {
        if (!data) return null;
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
}

export default Player;
