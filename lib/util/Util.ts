import { createDebug } from "./Debug.js";
import type { Messages } from "./types.js";
import type WolferyJS from "../WolferyJS.js";
import type { AnyClass, AnyObject, AnyRes, ResModel } from "resclient-ts";
import { setTimeout } from "node:timers/promises";

export function assign(target: object, ...sources: Array<object>): void {
    for (const source of sources) {
        for (const prop of Object.getOwnPropertyNames(source)) {
            if (prop === "constructor") {
                continue;
            }
            if (!Object.hasOwn(source, prop) || typeof (source as unknown as Record<string, unknown>)[prop] !== "function") {
                continue;
            }

            Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop)!);
        }
    }
}

export function toID<T extends (ResModel & { id: string; }) | string>(model: T): string {
    return typeof model === "string" ? model : model.id;
}

export interface WaitForCachedOptions<T extends AnyRes = AnyRes> {
    backoffFactor?: number;
    interval?: number;
    maxInterval?: number;
    timeout?: number;
    onFail?(this: void, client: WolferyJS, rid: string): Promise<T | null> | T | null;
}
export async function waitForCached<T extends AnyRes>(client: WolferyJS, rid: string, options: WaitForCachedOptions<T> = {}): Promise<T> {
    const debug = createDebug("client:waitForCached");
    const {
        backoffFactor = 1.5,
        interval = 100,
        maxInterval = 1000,
        timeout = 2000,
        onFail = (): null => null
    } = options;
    debug(`${rid} (t=${timeout}ms, i=${interval}ms, f=${backoffFactor})`);
    const start = Date.now();

    let currentInterval = interval;
    while (Date.now() - start < timeout) {
        const cached = client.api.getCached<T>(rid);
        if (cached) {
            debug(`Found: ${rid}`);
            return cached;
        }
        await setTimeout(currentInterval);
        currentInterval = Math.min(currentInterval * backoffFactor, maxInterval);
    }

    debug(`Not found: ${rid}`);
    const result = await onFail.call(undefined, client, rid);
    if (result) return result;

    throw new Error(`Timed out waiting for cached resource: ${rid}`);
}

export interface WaitForEventOptions<T = AnyObject> {
    timeout?: number;
    onFail?(this: void, client: WolferyJS, rid: string, event: string): Promise<T | null> | T | null;
}
export async function waitForEvent<T = AnyObject>(client: WolferyJS, rid: string, event: string, options: WaitForEventOptions<T> = {}): Promise<T> {
    const debug = createDebug("client:waitForEvent");
    const { timeout = 2000, onFail = (): null => null } = options;
    debug(`Waiting for event ${event} on ${rid} (t=${timeout}ms)`);

    return new Promise((resolve, reject) => {
        const onEvent = (data: T): void => {
            debug(`Received event ${event} on ${rid}`);
            client.api.resourceOff(rid, event, onEvent);
            resolve(data);
        };

        client.api.resourceOn(rid, event, onEvent);

        void setTimeout(timeout).then(async() => {
            client.api.resourceOff(rid, event, onEvent);

            debug(`Timed out waiting for event ${event} on ${rid}`);
            const result = await onFail.call(undefined, client, rid, event);
            if (result) return resolve(result);
            reject(new Error(`Timed out waiting for event ${event} on ${rid}`));
        });
    });
}

// based on how the client formats it
// https://github.com/mucklet/mucklet-client/blob/8a0bc7c8e6b8e56c731ba0229116cfbfc1eae824/src/client/modules/main/layout/charLog/rollEvent/RollEventComponent.js
export function formatRoll(results: Array<Messages.RollResultStd | Messages.RollResultMod>): Record<"text" | "details", string> {
    let s = "", d = "", showDetails = results.length > 1;
    for (const r of results) {
        if (s) {
            s += ` ${r.op || "+"} `;
        } else if (r.op === "-") {
            s += "-";
        }

        switch (r.type) {
            case "mod": {
                s += r.value;
                break;
            }

            case "std": {
                s += `${r.count}d${r.sides}`;
                showDetails ||= r.count > 1;
                break;
            }

            default: {
                s += (r as { type: string; }).type;
            }
        }
    }

    if (showDetails) {
        for (const r of results) {
            if (d) {
                d += ` ${r.op || "+"} `;
            } else if (r.op === "-") {
                d += ` ${r.op || "+"} `;
            }

            switch (r.type) {
                case "mod": {
                    d += r.value;
                    break;
                }

                case "std": {
                    const multi = r.dice.length > 1;
                    d += `${multi ? "(" : ""}${r.dice.join(", ")}${multi ? ")" : ""}d${r.sides}`;
                }
            }
        }
    }

    return { text: s, details: d };
}

export const DefToType =  {
    "any":            "any",
    "string":         "string",
    "?string":        "string | null",
    "number":         "number",
    "?number":        "number | null",
    "boolean":        "boolean",
    "?boolean":       "boolean | null",
    "object":         "object",
    "?object":        "object | null",
    "array":          "Array<any>",
    "?array":         "Array<any> | null",
    "array[string]":  "Array<string>",
    "?array[string]": "Array<string> | null",
    "array[number]":  "Array<number>",
    "?array[number]": "Array<number> | null",
    "function":       "Function",
    "?function":      "Function | null"
};

export function ridOnlyClass<C extends AnyClass>(clazz: C, rid: string): InstanceType<C> {
    return new ({ [clazz.name]: class {
        rid: string;
        constructor() {
            this.rid = rid;
        }
    } }[clazz.name]!)() as InstanceType<C>;
}

export function ridOnlyClassAndList<C extends AnyClass>(clazz: C, rid: string, list: Array<unknown>): InstanceType<C> {
    return new ({ [clazz.name]: class {
        // we want the list sorted after rid, the order of properties here is the order they're defined in
        rid: string;
        // eslint-disable-next-line @typescript-eslint/member-ordering
        list: Array<unknown>;
        constructor() {
            this.rid = rid;
            this.list = list;
        }
    } }[clazz.name]!)() as InstanceType<C>;
}

export const kEvents = Symbol.for("wolferyjs.events");
export const kControlledCharacter = (id: string): symbol => Symbol.for(`wolferyjs.controlledCharacter.${id}`);
export const kCharacter = (id: string): symbol => Symbol.for(`wolferyjs.character.${id}`);
export const kPlayer = (id: string): symbol => Symbol.for(`wolferyjs.player.${id}`);
