export enum IdleState {
    ASLEEP = 0,
    ACTIVE = 1,
    IDLE = 2,
    AWAY = 3,
}

export enum ErrorCodes {
    // System
    INVALID_REQUEST = "system.invalidRequest",
    CONNECTION_ERROR = "system.connectionError",
    DELETED = "system.deleted",
    NOT_FOUND = "system.notFound",
    ACCESS_DENIED = "system.accessDenied",
    DISCONNECT = "system.disconnect",
    TIMEOUT = "system.timeout",
    IDENTITY_SERVICE_NOT_AVAILABLE = "identity.serviceNotAvailable",

    // Core - Character
    CHAR_ALREADY_CONTROLLED = "core.charAlreadyControlled",
    CHAR_PROFILE_NOT_STORED = "core.charProfileNotStored",
    CHAR_PROFILE_NOT_FOUND = "core.charProfileNotFound",

    // Core - Room
    ROOM_PROFILE_NOT_STORED = "core.roomProfileNotStored",
    ROOM_PROFILE_NOT_FOUND = "core.roomProfileNotFound",
    TARGET_ROOM_NOT_OWNED = "core.targetRoomNotOwned",
    NEW_OWNER_NOT_ALLOWED = "core.newOwnerNotAllowed",
    EXIT_NOT_FOUND = "core.exitNotFound",
    CHAR_NOT_IN_ROOM = "core.charNotInRoom",

    // Core - Area

    // Core - Mail
    MISSING_MAIL_TEXT = "mail.missingMailText",

    // Backup
    AUTH_DATABASE_DUMP_FAILED = "backup.authDatabaseDumpFailed",
    CORE_DATABASE_DUMP_FAILED = "backup.coreDatabaseDumpFailed",
    FILE_DATABASE_DUMP_FAILED = "backup.fileDatabaseDumpFailed",
    IDENTITY_DATABASE_DUMP_FAILED = "backup.identityDatabaseDumpFailed",
    MAIL_DATABASE_DUMP_FAILED = "backup.mailDatabaseDumpFailed",
    NOTE_DATABASE_DUMP_FAILED = "backup.noteDatabaseDumpFailed",
    REPORT_DATABASE_DUMP_FAILED = "backup.reportDatabaseDumpFailed",
    TAG_DATABASE_DUMP_FAILED = "backup.tagDatabaseDumpFailed",

    // Identity
    UNKNOWN_USER = "identity.unknownUser",
}

export const PING_DURATION = 1000 * 60 * 15;
export const PublicPepper = "TheStoryStartsHere";
