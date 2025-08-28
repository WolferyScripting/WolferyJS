import type WolferyJS from "../WolferyJS.js";
import { ridOnlyClassAndList } from "../util/Util.js";
import CollectionListeners from "../util/CollectionListeners.js";
import { Properties, type ResClient, ResCollectionModel, type ResModelOptions } from "resclient-ts";
import util, { type InspectOptions } from "node:util";

export default class BaseCollectionModel<T = unknown> extends ResCollectionModel<T> {
    protected client!: WolferyJS;
    listeners!: CollectionListeners<this>;
    constructor(client: WolferyJS, api: ResClient, rid: string, validateItem: (item: T) => boolean, options?: Omit<ResModelOptions, "definition">) {
        super(api, rid, validateItem, options);
        Properties.of(this)
            .readOnly("client", client)
            .readOnly("listeners", new CollectionListeners(this));
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        if (on) this.listeners.activate();
        else this.listeners.deactivate();
    }

    [util.inspect.custom](depth: number, inspectOptions: InspectOptions, inspect: typeof util.inspect): string {
        const base = inspect(ridOnlyClassAndList(this.constructor as typeof BaseCollectionModel<T>, this.rid, this.list), inspectOptions).split("\n");
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
