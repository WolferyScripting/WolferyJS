import type { Debug as DebugType } from "debug";
import { formatWithOptions } from "node:util";

// the things I do for esm first with cjs support
let debug: DebugType | undefined | null;
function getDebug(): Promise<DebugType | null> | DebugType | null {
    if (debug !== undefined) return debug;
    try {
        // eslint-disable-next-line unicorn/prefer-module
        if (typeof require === "undefined") {
            return import("debug").then(mod => (debug = mod.default)).catch(() => (debug = null));
        } else {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
            debug = (require("debug") as { default: DebugType; }).default;
        }
    } catch {
        debug = null;
    }
    return debug;
}

let depth: number | undefined;
export function Debug(namspace: string, arg0: unknown, ...args: Array<unknown>): void {
    const log = (dt: DebugType): void => dt(`wolferyjs:${namspace}`)(formatWithOptions({ colors: true, showHidden: false, depth }, arg0, ...args));
    const d = getDebug();
    if (d instanceof Promise) {
        void d.then(dt => {
            if (dt) {
                log(dt);
            }
        });
    } else if (d) {
        log(d);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createDebug(namespace: string): (formatter: any, ...args: Array<any>) => void {
    const d = getDebug();
    if (!d || d instanceof Promise) {
        return () => {}; // noop
    }
    return d(`wolferyjs:${namespace}`);
}

/**
 * Set the inspection depth for debug messages.
 * @param d The depth.
 */
export function setDebugDepth(d: number): void {
    depth = d;
}
