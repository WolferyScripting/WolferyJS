import type {
    Messages,
    NavDirections,
    NavIcons,
    RealmConfig,
    RealmConfigOverseer
} from "./types.js";

declare namespace Commands {
    export interface LogEvents {
        endTime: number;
        events: Array<Messages.Any>;
        startTime: number;
    }

    export namespace ControlledCharacter {
        export interface AddTeleportOptions {
            /** The key to use to teleport to the room. */
            key: string;
            /** The ID of the room. */
            roomId: string;
        }

        export interface SetExitOptions {
            /** A message seen by the arrival room. */
            arriveMsg?: string;
            /** If the exit is hidden. */
            hidden?: boolean;
            /** The icon for the exit. */
            icon?: NavIcons | "";
            /** If the exit is inactive. */
            inactive?: boolean;
            /** The keys for the exit. */
            keys?: Array<string>;
            /** A message seen by the origin room. */
            leaveMsg?: string;
            /** The name of the exit. */
            name?: string;
            /** The direction of the exit. */
            nav?: NavDirections | "";
            /** If characters in adjacent rooms can see characters in this room. */
            transparent?: boolean;
            /** A message seen by the exit user. */
            travelMsg?: string;
        }

        export interface SetRoomProfileOptions {
            /** The description of the room. */
            desc?: string;
            /** The key used to apply the profile. */
            key?: string;
            /** The name of the room. */
            name?: string;
        }

        export interface SetTeleportOptions {
            /** The new key. */
            key: string;
        }

        export interface AddressOptions {
            /** The message to send. */
            msg: string;
            /** If the message should be a pose. */
            ooc?: boolean;
            /** If the message should be ooc. */
            pose?: boolean;
        }

        export interface MessageOptions {
            /** The text of the message. */
            msg: string;
            /** If the message should be a pose. */
            ooc?: boolean;
            /** If the message should be ooc. */
            pose?: boolean;
        }

        export interface WhisperOptions {
            /** The text of the whisper. */
            msg: string;
            /** If the whisper should be a pose. */
            ooc?: boolean;
            /** If the whisper should be ooc. */
            pose?: boolean;
        }

        export interface OOCOptions {
            /** The text of the message. */
            msg: string;
            /** If the message should be a pose. */
            pose?: boolean;
        }

        export interface CreateRoomScriptOptions {
            /** Whether the script is active. */
            active?: boolean;
            /** The source code of the script. */
            source?: string;
        }

        export interface SetRoomScriptOptions {
            /** Whether the script is active. */
            active?: boolean;
            /** The key for the script. */
            key?: string;
            /** The source code of the script. */
            source?: string;
        }

        export interface RequestSetRoomOptions {
            areaId?: string;
        }

        export interface SetAreaOptions {
            /** The about of the area. */
            about?: string;
            /** If custom messages should be shown when teleporting. */
            customTeleportMsgs?: boolean;
            /** The name of the area. */
            name?: string;
            /** If character-specific teleport messages should be overridden. */
            overrideCharTeleportMsgs?: boolean;
            /** The parent area. */
            parentId?: string | null;
            /** The rules of the area. */
            rules?: string;
            /** The short description of the area. */
            shortDesc?: string;
            teleportArriveMsg?: string;
            teleportLeaveMsg?: string;
            teleportTravelMsg?: string;
        }

        export interface SetLocation {
            /** The X position of the area or room on the map. */
            mapX?: number;
            /** The Y position of the area or room on the map. */
            mapY?: number;
            /** If the area or room is private. */
            private?: boolean;
        }

        export interface SetOptions {
            /** The about of the character. */
            about?: string;
            /** The description of the character. */
            desc?: string;
            /** The gender of the character. */
            gender?: string;
            /** The name of the character. */
            name?: string;
            /** The species of the character. */
            species?: string;
            /** The surname of the character. */
            surname?: string;
            /** Message seen by the target room. */
            teleportArriveMsg?: string;
            /** Message seen by the origin room. */
            teleportLeaveMsg?: string;
            /** Message seen by you. */
            teleportTravelMsg?: string;
        }

        export interface SetProfileOptions {
            /** The about of the profile. */
            about?: string;
            /** The description of the profile. */
            desc?: string;
            /** The gender of the profile. */
            gender?: string;
            /** The key used to apply the profile. */
            key?: string;
            /** The name of the profile. */
            name?: string;
            /** The species of the profile. */
            species?: string;
        }

        export interface SetPuppetOptions {
            /** How to play the character. */
            howtoplay?: string;
        }

        export interface SetRoomOptions {
            /** The area of the room. */
            areaId?: string | null;
            /** If the room should autosweep sleepers. */
            autosweep?: boolean;
            /** The delay for autosweeping. */
            autosweepdelay?: number;
            /** The description of the room. */
            desc?: string;
            /** If the room is dark. */
            isdark?: boolean;
            /** If the room can be set as home. */
            ishome?: boolean;
            /** If the room is an instance. */
            isinstance?: boolean;
            /** If the room is quiet. */
            isquiet?: boolean;
            /** If the room can be added as a teleport. */
            isteleport?: boolean;
            /** The name of the room. */
            name?: string;
            /** If character-specific teleport messages should be overridden. */
            overrideCharTeleportMsgs?: boolean;
            teleportArriveMsg?: string;
            teleportLeaveMsg?: string;
            teleportTravelMsg?: string;
        }

        export interface GetExitOptions {
            exitId?: string;
            exitKey?: string;
        }

        export interface TeleportOptions {
            nodeId?: string;
            roomId?: string;
        }
    }

    export namespace Player {
        export interface SetCharSettingsOptions {
            /** If DND should be enabled. */
            dnd?: boolean;
            /** The message shown when DND is enabled. */
            dndMsg?: string;
            /** Only usable by staff. */
            ishelping?: boolean;
            /** The description shown when LFRP is enabled. */
            lfrpDesc?: string;
            /** If the character should be notified on all events. This is used for `@all` in `focus` & `unfocus`. */
            notifyOnAll?: boolean;
            /** If the character is a puppet, the ID of character which is controlling the puppet. */
            puppeteerId?: string;
            /** A list of triggers for the character. Set the value to `true` to add it, and `false` to remove it. */
            triggers?: Record<string, boolean>;
        }

        export interface SetProfileOptions {
            /** If custom messages should be shown when teleporting. */
            customTeleportMsgs?: boolean;
            /** The description of the character. */
            desc?: string;
            /** The gender of the character. */
            gender?: string;
            /** The key used to apply the profile. */
            key?: string;
            /** If messages should be muted. */
            muteMessage?: boolean;
            /** If OOC messages should be muted. */
            muteOoc?: boolean;
            /** If travel messages should be muted. */
            muteTravel?: boolean;
            /** The name of the character. */
            name?: string;
            /** The species of the character. */
            species?: string;
            /** The message shown to the target room when teleporting. */
            teleportArriveMsg?: string;
            /** The message shown to the origin room when teleporting. */
            teleportLeaveMsg?: string;
            /** The message shown to the character when teleporting. */
            teleportTravelMsg?: string;
        }

        export interface FocusCharOptions {
            /** The color. */
            color?: string;
            /** The ID of the target character. */
            targetId: string;
        }
    }

    export namespace CharacterTags {
        export interface CreateOptions {
            /** The description of the tag. */
            desc?: string;
            /** The key for the tag. */
            key: string;
            /** The preference for the tag. */
            pref: "like" | "dislike";
        }
    }

    export namespace Inbox {
        export interface SendOptions {
            /** If the mail should be a pose. */
            ooc?: boolean;
            /** If the mail should be ooc. */
            pose?: boolean;
            /** The text of the mail. */
            text: string;
        }
    }

    export namespace Identity {
        export interface SetOptions {
            allowNewsletter?: boolean;
        }
    }
    export namespace Moderator {
        export interface SetPlayerOptions {
            trusted?: boolean;
        }
    }
    export namespace Admin {
        export interface CreateGlobalTagOptions {
            desc?: string | null;
            group?: string | null;
            key: string;
        }
        export interface CreateTagGroupOptions {
            key: string;
            name?: string;
            order?: number;
        }
        export interface SetCharOptions {
            about?: string;
            desc?: string;
            gender?: string;
            name?: string;
            species?: string;
            surname?: string;
        }
        export type SetConfigOptions = Partial<RealmConfig>;
        export interface SetGlobalTagOptions {
            desc?: string;
            group?: string;
            key?: string;
            parentId?: string;
        }
        export interface SetTagGroupOptions {
            name?: string;
            order?: number;
        }
    }
    export namespace Overseer {
        export interface CreateUserLoginOptions {
            password: string;
            username: string;
        }
        export type SetConfigOptions = Partial<RealmConfigOverseer>;
        export interface SetUserOptions {
            email?: string;
            emailVerified?: boolean;
            name?: string;
            username?: string;
        }
    }
}
export default Commands;
