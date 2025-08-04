import type { Writeable } from "../util/types.js";

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/explicit-function-return-type*/
namespace ResourceIDs {
    function arg<Name extends string>(name: Name): Arg<Name> {
        return { __arg__: name } as Arg<Name>;
    }

    interface Arg<Name extends string> {
        __arg__: Name;
    }

    type ExtractArgs<T extends ReadonlyArray<unknown>> =
    T[number] extends Arg<infer Name> ? Name : never;

    type ArgObject<T extends ReadonlyArray<unknown>> =
    ExtractArgs<T> extends infer U
        ? [U] extends [never]
            ? unknown
            : { [K in U & string]: string }
        : never;

    interface RIDFunction<Parts extends ReadonlyArray<unknown>> {
        (args: ArgObject<Parts>): string;
        get regex(): RegExp;
        parts(value: string): ArgObject<Parts>;
    }

    function f<Parts extends ReadonlyArray<unknown>>(
        strings: TemplateStringsArray,
        ...exprs: Parts
    ): RIDFunction<Parts> {
        const func =  (args: Record<string, string>): string => {
            let result = strings[0]!;
            for (const [i, expr] of exprs.entries()) {
                let value: string;
                if (typeof expr === "object" && expr && "__arg__" in expr) {
                    value = args[(expr as Arg<string>).__arg__]!;
                } else {
                    value = String(expr);
                }
                result += value + strings[i + 1]!;
            }
            return result;
        };
        const names = exprs.map(expr => (typeof expr === "object" && expr && "__arg__" in expr ? (expr as Arg<string>).__arg__ : undefined)).filter((name): name is string => name !== undefined);
        Object.defineProperty(func, "regex", {
            get() {
                const pattern = strings.reduce((acc, str, i) => acc + str.replaceAll(".", String.raw`\.`) + (i < exprs.length ? `(?<${names[i]}>[^.]+)` : ""), "");
                return new RegExp(`^${pattern}$`);
            }
        });
        func.parts = (value: string) => getRIDParts(func as unknown as RIDFunction<Writeable<Parts>>, value);
        return func satisfies ((args: ArgObject<Parts>) => string) as unknown as RIDFunction<Parts>;
    }

    export function getRIDParts<T extends RIDFunction<Array<unknown>>>(func: T, value: string): T extends RIDFunction<infer Parts> ? ArgObject<Parts> : never {
        const r = func.regex;
        const match = r.exec(value);
        if (!match) {
            throw new Error(`No match: ${r.source} for ${value}`);
        }
        return match.groups as T extends RIDFunction<infer Parts> ? ArgObject<Parts> : never;
    }

    const id = arg("id");
    const char = arg("char");
    const puppet = arg("puppet");
    const room = arg("room");
    const instance = arg("instance");
    const player = arg("player");
    const message = arg("message");
    const script = arg("script");
    const binary = arg("binary");
    const ctrl = arg("ctrl");
    export const AFAR_ROOM = f`core.room.${id}.afar`;
    export const AREA = f`core.area.${id}`;
    export const AREA_CHILD = f`core.area.${id}.child`;
    export const AREA_CHILDREN = f`core.area.${id}.children`;
    export const AREA_DETAILS = f`core.area.${id}.details`;
    export const AWAKE_CHARACTERS = "core.chars.awake";
    export const BOT = f`core.bot.${id}`;
    export const CHARACTER = f`core.char.${id}`;
    export const CHARACTER_DETAILS = f`core.char.${id}.details`;
    export const CHARACTER_INFO = f`core.char.${id}.info`;
    export const CHARACTER_MIN = f`core.char.${id}.min`;
    export const CONTROLLED_CHARACTER = f`core.char.${id}.ctrl`;
    export const CONTROLLED_PUPPET = f`core.char.${char}.puppet.${puppet}.ctrl`;
    export const EXIT = f`core.exit.${id}`;
    export const EXIT_DETAILS = f`core.exit.${id}.details`;
    export const CHARACTER_FOCUS = f`core.char.${id}.focus`;
    export const PUPPET_FOCUS = f`core.char.${char}.puppet.${puppet}.focus`;
    export const CHARACTER_FOCUS_CHARS = f`core.char.${id}.focus.chars`;
    export const PUPPET_FOCUS_CHARS = f`core.char.${char}.puppet.${puppet}.focus.chars`;
    export const IDENTITY = f`identity.user.${id}`;
    export const AREA_IMAGE = f`core.area.img.${id}`;
    export const CHARACTER_IMAGE = f`core.char.img.${id}`;
    export const ROOM_IMAGE = f`core.room.img.${id}`;
    export const LOOK_AT = f`core.lookat.char.${char}.inroom.${room}`;
    export const LOOKED_AT = f`core.lookedat.char.${char}.inroom.${room}`;
    export const LOOKED_AT_INSTANCE = f`core.instance.${instance}.lookedat.char.${char}.inroom.${room}`;
    export const MAIL_MESSAGE = f`mail.message.${id}`;
    export const MUTED_CHARACTERS = f`core.player.${id}.mutedchars`;
    export const NODE = f`core.node.${id}`;
    export const NOTE = f`note.player.${player}.note.${char}`;
    export const NOTES = f`note.player.${id}.notes`;
    export const CHARACTER_OWNED = f`core.char.${id}.owned`;
    export const PLAYER = f`core.player.${id}`;
    export const PLAYER_MAIL_MESSAGE = f`mail.player.${player}.message.${message}`;
    export const PROFILE = f`core.profile.${id}`;
    export const PUPPET = f`core.char.${char}.puppet.${puppet}`;
    export const PUPPET_INFO = f`core.puppet.${id}.info`;
    export const REQUEST = f`core.request.${id}`;
    export const REQUEST_PARAMS = f`core.request.${id}.params`;
    export const ROOM = f`core.room.${id}`;
    export const ROOM_CHARACTER = f`core.char.${id}.inroom`;
    export const ROOM_CHILD = f`core.room.${id}.child`;
    export const ROOM_COMMAND = f`core.roomcmd.${id}`;
    export const ROOM_COMMANDS = f`core.room.${id}.cmds`;
    export const ROOM_DETAILS = f`core.room.${id}.details`;
    export const ROOM_INSTANCE_DETAILS = f`core.instance.${instance}.room.${room}.details`;
    export const ROOM_PROFILE = f`core.roomprofile.${id}`;
    export const ROOMSCRIPT = f`core.roomscript.${id}`;
    export const ROOMSCRIPT_DETAILS = f`core.roomscript.${id}.details`;
    export const SAFE_USER = f`auth.user.${id}.safe`;
    export const SCRIPT_BINARY = f`core.script.${script}.binary.${binary}`;
    export const SCRIPT_LOG = f`core.script.log.${id}`;
    export const CHARACTER_SETTINGS = f`core.char.${id}.settings`;
    export const PUPPET_SETTINGS = f`core.char.${ctrl}.puppet.${puppet}.settings`;
    export const TAG = f`tag.tag.${id}`;
    export const CHARACTER_TAGS = f`tag.char.${id}.tags`;
    export const UNREAD_MAIL = f`mail.player.${id}.unread`;
    export const USER = f`auth.user.${id}`;
    export const WATCH = f`note.player.${player}.watch.${char}`;
    export const WATCHES = f`note.player.${id}.watches`;
    export const CHARACTER_NODES = f`core.char.${id}.nodes`;
    export const CONTROLLED_CHARACTERS = f`core.player.${id}.ctrls`;
    export const EXITS = f`core.room.${id}.exits`;
    export const NODES = "core.nodes";
    export const INBOX = f`mail.player.${id}.inbox`;
    export const OWNED_AREAS = f`core.char.${id}.areas`;
    export const OWNED_CHARACTERS = f`core.player.${id}.chars`;
    export const OWNED_ROOMS = f`core.char.${id}.rooms`;
    export const PROFILES = f`core.char.${id}.profiles`;
    export const PUPPETS = f`core.player.${id}.puppets`;
    export const OUTGOING_REQUESTS = f`core.player.${id}.outgoing.requests`;
    export const INCOMING_REQUESTS = f`core.player.${id}.incoming.requests`;
    export const ROOM_CHARACTERS = f`core.room.${id}.chars`;
    export const ROOM_INSTANCE_CHARACTERS = f`core.instance.${instance}.room.${room}.chars`;
    export const ROOM_CHARACTERS_AWAKE = f`core.room.${id}.chars.awake`;
    export const ROOM_INSTANCE_CHARACTERS_AWAKE = f`core.instance.${instance}.room.${room}.chars.awake`;
    export const ROOM_PROFILES = f`core.room.${id}.profiles`;
    export const SCRIPT_LOGS = f`core.script.${id}.logs`;
    export const CHARACTER_SETTINGS_TRIGGERS = f`core.char.${id}.settings.triggers`;
    export const PUPPET_SETTINGS_TRIGGERS = f`core.char.${ctrl}.puppet.${puppet}.settings.triggers`;

    export const ROLLER = f`roller.char.${id}`;
    export const TAGS = "tag.tags";
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/explicit-function-return-type*/

export default ResourceIDs;
