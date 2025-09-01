import Base from "./Base.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import { type LookupCharacter, type CharacterResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import { modelId } from "../util/Util.js";
import type AuthNotices from "../collections/AuthNotices.js";
import type Bots from "../models/Bots.js";
import type Character from "../models/Character.js";
import type IdentityNotices from "../collections/IdentityNotices.js";
import type Inbox from "../collections/Inbox.js";
import type IncomingRequests from "../collections/IncomingRequests.js";
import type Note from "../models/Note.js";
import type Notes from "../models/Notes.js";
import type OutgoingRequests from "../collections/OutgoingRequests.js";
import type Tokens from "../collections/Tokens.js";
import type UnreadMail from "../models/UnreadMail.js";
import type Watches from "../models/Watches.js";
import type Player from "../models/Player.js";
import type OwnedCharacter from "../models/OwnedCharacter.js";
import type Token from "../models/Token.js";
import type Bot from "../models/Bot.js";

export default class PlayerCommands extends Base {
    /**
     * Accept a request.
     * @param player A {@link Player} instance or ID.
     * @param requestId The ID of the request to accept.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async acceptRequest(player: string | Player, requestId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.PLAYER({ id: modelId(player) }), "acceptRequest", { requestId });
    }

    /**
     * Append to the note for a character. The text will be added on a new line.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to append the note for.
     * @param text The text to append to the note.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async appendNote(player: string | Player, charId: string, text: string): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.NOTE({ player: modelId(player), char: charId }), "append", { text })
            .then(r => r.char);
    }

    /**
     * Control a character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to control.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async controlChar(player: string | Player, charId: string): Promise<ControlledCharacter> {
        return this.client.api.call<ControlledCharacter>(ResourceIDs.PLAYER({ id: modelId(player) }), "controlChar", { charId });
    }

    /**
     * Control a puppet.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to control.
     * @param puppetId The ID of the puppet to control.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async controlPuppet(player: string | Player, charId: string, puppetId: string): Promise<ControlledCharacter> {
        return this.client.api.call<ControlledCharacter>(ResourceIDs.PLAYER({ id: modelId(player) }), "controlPuppet", { charId, puppetId });
    }

    /**
     * Create a bot token for a character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to create a bot for.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async createBot(player: string | Player, charId: string): Promise<Bot> {
        return this.client.api.call<Bot>(ResourceIDs.BOTS({ id: modelId(player) }), "create", { charId });
    }

    /**
     * Create a new character.
     * @param player A {@link Player} instance or ID.
     * @param options The options for creating the character.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async createChar(player: string | Player, options: Commands.Player.CreateCharOptions): Promise<OwnedCharacter> {
        return this.client.api.call<OwnedCharacter>(ResourceIDs.PLAYER({ id: modelId(player) }), "createChar", options);
    }

    /**
     * Create a management token.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async createToken(player: string | Player): Promise<Token> {
        return this.client.api.call<Token>(ResourceIDs.TOKENS({ id: modelId(player) }), "create");
    }

    /**
     * Delete a character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to delete.
     * @param heir The ID of the character to inherit any rooms or items of the deleted character.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async deleteChar(player: string | Player, charId: string, heir: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.PLAYER({ id: modelId(player) }), "deleteChar", { charId, heir });
    }

    /**
     * Delete a mail message.
     * @param player A {@link Player} instance or ID.
     * @param messageId The ID of the message to delete.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async deleteMail(player: string | Player, messageId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.PLAYER_MAIL_MESSAGE({ player: modelId(player), message: messageId }), "delete");
    }

    /**
     * Delete a note. This is the same as setting the text as empty.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to delete the note for.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async deleteNote(player: string | Player, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.NOTE({ player: modelId(player), char: charId }), "delete")
            .then(r => r.char);
    }

    /**
     * Focus a character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to focus with.
     * @param targetId The ID of the character to focus.
     * @param options The options for focusing the character.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async focusChar(player: string | Player, charId: string, targetId: string, options?: Commands.Player.FocusCharOptions): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.PLAYER({ id: modelId(player) }), "focusChar", { charId, targetId, ...options })
            .then(r => r.char);
    }

    /**
     * Get the auth notices for the player.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getAuthNotices(player: string | Player): Promise<AuthNotices> {
        return this.client.api.get<AuthNotices>(ResourceIDs.AUTH_NOTICES({ id: modelId(player) }));
    }

    /**
     * Get the bots for the player.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getBots(player: string | Player): Promise<Bots> {
        return this.client.api.get<Bots>(ResourceIDs.BOTS({ id: modelId(player) }));
    }

    /**
     * Get a character.
     * @param player A {@link Player} instance or ID.
     * @param options The options for getting the character.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async getChar(player: string | Player, options: Commands.Player.GetCharOptions): Promise<Character> {
        return this.client.api.call<Character>(ResourceIDs.PLAYER({ id: modelId(player) }), "getChar", options);
    }

    /**
     * Get the identity notices for the player.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getIdentityNotices(player: string | Player): Promise<IdentityNotices> {
        return this.client.api.get<IdentityNotices>(ResourceIDs.IDENTITY_NOTICES({ id: modelId(player) }));
    }

    /**
     * Get the inbox for the player.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getInbox(player: string | Player): Promise<Inbox> {
        return this.client.api.get<Inbox>(ResourceIDs.INBOX({ id: modelId(player) }));
    }

    /**
     * Get the incoming requests.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getIncomingRequests(player: string | Player): Promise<IncomingRequests> {
        return this.client.api.get<IncomingRequests>(ResourceIDs.INCOMING_REQUESTS({ id: modelId(player) }));
    }

    /**
     * Get the note for a character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to get the note for.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getNote(player: string | Player, charId: string): Promise<Note> {
        return this.client.api.get<Note>(ResourceIDs.NOTE({ player: modelId(player), char: charId }));
    }

    /**
     * Get the notes for characters.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getNotes(player: string | Player): Promise<Notes> {
        return this.client.api.get<Notes>(ResourceIDs.NOTES({ id: modelId(player) }));
    }

    /**
     * Get the outgoing requests.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getOutgoingRequests(player: string | Player): Promise<OutgoingRequests> {
        return this.client.api.get<OutgoingRequests>(ResourceIDs.OUTGOING_REQUESTS({ id: modelId(player) }));
    }

    /**
     * Get the management tokens for the player.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getTokens(player: string | Player): Promise<Tokens> {
        return this.client.api.get<Tokens>(ResourceIDs.TOKENS({ id: modelId(player) }));
    }

    /**
     * Get the unread mail for the player.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getUnreadMail(player: string | Player): Promise<UnreadMail> {
        return this.client.api.get<UnreadMail>(ResourceIDs.UNREAD_MAIL({ id: modelId(player) }));
    }

    /**
     * Get the characters being watched.
     * @param player A {@link Player} instance or ID.
     * @playerRequired
     * @calls {@link ResClient.get}
     */
    async getWatches(player: string | Player): Promise<Watches> {
        return this.client.api.get<Watches>(ResourceIDs.WATCHES({ id: modelId(player) }));
    }

    /**
     * Lookup characters by name.
     * @param player A {@link Player} instance or ID.
     * @param name The name to lookup.
     * @returns An array of matching characters.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async lookupChars(player: string | Player, name: string): Promise<Array<LookupCharacter>> {
        return this.client.api.call<{ chars: Array<LookupCharacter>; }>(ResourceIDs.PLAYER({ id: modelId(player) }), "lookupChars", { name, extended: true })
            .then(r => r.chars);
    }

    /**
     * Send a mail to a character.
     * @param player A {@link Player} instance or ID.
     * @param fromChar A {@link ControlledCharacter} instance or ID.
     * @param toCharId The ID of the character to send the mail to.
     * @param options The options for the mail.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async mail(player: string | Player, fromChar: string | ControlledCharacter, toCharId: string, options: Commands.Player.MailOptions): Promise<CharacterResponse> {
        return this.client.api.call<{ toChar: CharacterResponse; }>(ResourceIDs.INBOX({ id: modelId(player) }), "send", { fromCharId: modelId(fromChar), toCharId, ...options })
            .then(r => r.toChar);
    }

    /**
     * Manage muted characters. Set an id to true to mute, false to unmute.
     * @param player A {@link Player} instance or ID.
     * @param chars
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async muteChars(player: string | Player, chars: Record<string, boolean>): Promise<null> {
        return this.client.api.call<Record<string, boolean>>(ResourceIDs.PLAYER({ id: modelId(player) }), "muteChars", { chars }).then(() => null);
    }

    /**
     * Read a mail message.
     * @param player A {@link Player} instance or ID.
     * @param messageId The ID of the message to read.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async readMail(player: string | Player, messageId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.PLAYER_MAIL_MESSAGE({ player: modelId(player), message: messageId }), "read");
    }

    /**
     * Reject a request.
     * @param player A {@link Player} instance or ID.
     * @param requestId The ID of the request to reject.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async rejectRequest(player: string | Player, requestId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.PLAYER({ id: modelId(player) }), "rejectRequest", { requestId });
    }

    /**
     * Revoke a request.
     * @param player A {@link Player} instance or ID.
     * @param requestId The ID of the request to revoke.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async revokeRequest(player: string | Player, requestId: string): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.PLAYER({ id: modelId(player) }), "revokeRequest", { requestId });
    }

    /**
     * Set character settings.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to set the settings for.
     * @param options The settings to apply.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async setCharSettings(player: string | Player, charId: string, options: Commands.Player.SetCharSettingsOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.PLAYER({ id: modelId(player) }), "setCharSettings", { charId, ...options });
    }

    /**
     * Set options for the player's identity.
     * @param player A {@link Player} instance or ID.
     * @param options The options to set.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async setIdentity(player: string | Player, options: Commands.Player.SetIdentityOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.IDENTITY({ id: modelId(player) }), "set", options);
    }

    /**
     * Set the note for a character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to set the note for.
     * @param options The options for setting the note.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async setNote(player: string | Player, charId: string, options: Commands.Player.SetNoteOptions): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.NOTE({ player: modelId(player), char: charId }), "set", options)
            .then(r => r.char);
    }

    /**
     * Set preferences.
     * @param player A {@link Player} instance or ID.
     * @param options The options to set.
     * @playerRequired
     * @staffRoleRequired
     * @calls {@link ResClient.call}
     */
    async setPreference(player: Player | string, options: Commands.Player.SetPreferenceOptions): Promise<null> {
        return this.client.api.call<null>(ResourceIDs.PLAYER({ id: modelId(player) }), "setPreference", options);
    }

    /**
     * Unfocus a character.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to unfocus with.
     * @param targetId The ID of the character to unfocus.
     * @param puppeteerId The ID of the puppeteer character, if applicable.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async unfocusChar(player: string | Player, charId: string, targetId: string, puppeteerId?: string): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.PLAYER({ id: modelId(player) }), "unfocusChar", { charId, targetId, puppeteerId })
            .then(r => r.char);
    }

    /**
     * Remove a character from your watch list.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to unwatch.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async unwatchChar(player: string | Player, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.WATCH({ player: modelId(player), char: charId }), "delete")
            .then(r => r.char);
    }

    /**
     * Add a character to your watch list.
     * @param player A {@link Player} instance or ID.
     * @param charId The ID of the character to watch.
     * @playerRequired
     * @calls {@link ResClient.call}
     */
    async watchChar(player: string | Player, charId: string): Promise<CharacterResponse> {
        return this.client.api.call<{ char: CharacterResponse; }>(ResourceIDs.WATCH({ player: modelId(player), char: charId }), "addWatcher")
            .then(r => r.char);
    }
}
