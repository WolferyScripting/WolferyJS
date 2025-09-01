import type WolferyJS from "../WolferyJS.js";
import { ridOnlyClassAndList } from "../util/Util.js";
import CollectionListeners from "../util/CollectionListeners.js";
import type ResourceIDs from "../generated/ResourceIDs.js";
import {
    type AnyRes,
    copy,
    Properties,
    type ResClient,
    ResCollection,
    type ResRef
} from "resclient-ts";
import util, { type InspectOptions } from "node:util";

export default class  BaseCollection<V = unknown, R extends ResourceIDs.RIDFunction<Array<unknown>> = ResourceIDs.RIDFunction<Array<unknown>>> extends ResCollection<V> {
    protected client!: WolferyJS;
    protected ridConstructor?: R;
    listeners!: CollectionListeners<this>;
    constructor(client: WolferyJS, api: ResClient, rid: string, options?: {
        ridConstructor?: R;
        idCallback?(item: V): string;
    }) {
        super(api, rid, options);
        options = copy(options ?? {}, {
            ridConstructor: { type: "?function" }
        });
        Properties.of(this)
            .readOnly("client", client)
            .readOnly("ridConstructor", options.ridConstructor)
            .readOnly("listeners", new CollectionListeners(this));
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        if (on) this.listeners.activate();
        else this.listeners.deactivate();
    }

    get isPaginated(): boolean {
        return this.paginationOffset !== null || this.paginationLimit !== null;
    }

    get paginationLimit(): number | null {
        const match = this.rid.match(/limit=(\d+)/);
        return match ? Number(match[1]) : null;
    }

    get paginationOffset(): number | null {
        const match = this.rid.match(/offset=(\d+)/);
        return match ? Number(match[1]) : null;
    }

    async fetch(...args: R["__typesOnlyArgs"]): Promise<V extends ResRef<infer T> ? T : V> {
        if (!this.ridConstructor) throw new Error("RID constructor is not defined");
        const arg = this.ridConstructor.names.reduce((acc, name, index) => {
            acc[name] = args[index];
            return acc;
        }, {} as Record<string, unknown>);
        const rid = this.ridConstructor(arg);
        return this.api.get<AnyRes>(rid) as V extends ResRef<infer T> ? T : V;
    }

    async getNextPage(): Promise<this | null> {
        if (!this.isPaginated) return null;
        const offset = this.paginationOffset!;
        const limit = this.paginationLimit!;
        const nextOffset = offset + limit;
        const nextRid = this.rid.replace(/offset=\d+/, `offset=${nextOffset}`);
        return this.api.get<this>(nextRid);
    }
}

export function enableCustomInspectForCollections(): void {
    if (util.inspect.custom in BaseCollection.prototype) return;
    Object.defineProperty(BaseCollection.prototype, util.inspect.custom, {
        value(this: BaseCollection, depth: number, inspectOptions: InspectOptions, inspect: typeof util.inspect): string {
            return inspect(ridOnlyClassAndList(this.constructor as typeof BaseCollection, this.rid, this.list), inspectOptions);
        }
    });
}
