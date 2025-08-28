import type { Writable } from "@util/types.js";

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/explicit-function-return-type*/
namespace ResourceIDs {
    export function arg<Name extends string>(name: Name): Arg<Name> {
        return { __arg__: name } as Arg<Name>;
    }

    export interface Arg<Name extends string> {
        __arg__: Name;
    }

    export type ExtractArgs<T extends ReadonlyArray<unknown>> =
    T[number] extends Arg<infer Name> ? Name : never;

    export type ArgObject<T extends ReadonlyArray<unknown>> =
    ExtractArgs<T> extends infer U
        ? [U] extends [never]
            ? unknown
            : { [K in U & string]: string }
        : never;

    export interface RIDFunction<Parts extends ReadonlyArray<unknown>> {
        (args: ArgObject<Parts>): string;
        get regex(): RegExp;
        parts(value: string): ArgObject<Parts>;
    }

    export function f<Parts extends ReadonlyArray<unknown>>(
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
        func.parts = (value: string) => getRIDParts(func as unknown as RIDFunction<Writable<Parts>>, value);
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

    export const id = arg("id");
    /* =args(exclude=id) */
    /* =ids */

    export const ROLLER = f`roller.char.${id}`;
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/explicit-function-return-type*/

export default ResourceIDs;
