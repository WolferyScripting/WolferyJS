import type WolferyJS from "../WolferyJS.js";
import { ridOnlyClassAndList } from "../util/Util.js";
import { type ResClient, ResCollection } from "resclient-ts";
import util, { type InspectOptions } from "node:util";

export default class  BaseCollection<V = unknown> extends ResCollection<V> {
    protected client!: WolferyJS;
    constructor(client: WolferyJS, api: ResClient, rid: string, options?: {
        idCallback?(item: V): string;
    }) {
        super(api, rid, options);
        Object.defineProperty(this, "client", {
            enumerable: false,
            value:      client
        });
    }

    [util.inspect.custom](depth: number, inspectOptions: InspectOptions, inspect: typeof util.inspect): string {
        const base = inspect(ridOnlyClassAndList(this.constructor as typeof BaseCollection<V>, this.rid, this.list), inspectOptions).split("\n");
        const listStart = base.findIndex(l => l.includes("list: ["));
        const listEnd = base.findIndex(l => l.includes("]"), listStart);
        let list = base.splice(listStart, listEnd - listStart + 1).join("\n");
        if (list.at(-1) === ",") {
            list = list.slice(0, -1);
            base[base.length - 2] = `${base.at(-2)},`;
        }
        base.splice(-1, 0, list.replace("list: ", ""));
        return base.join("\n");
    }
}
