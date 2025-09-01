import type WolferyJS from "../WolferyJS.js";
import { ridOnlyClassAndList } from "../util/Util.js";
import CollectionListeners from "../util/CollectionListeners.js";
import type ResourceIDs from "../generated/ResourceIDs.js";
import {
    type AnyRes,
    copy,
    Properties,
    type ResClient,
    ResCollectionModel,
    type ResCollectionModelOptions,
    type ResRef
} from "resclient-ts";
import util, { type InspectOptions } from "node:util";

export default class BaseCollectionModel<T = unknown, R extends ResourceIDs.RIDFunction<Array<unknown>> = ResourceIDs.RIDFunction<Array<unknown>>> extends ResCollectionModel<T> {
    protected client!: WolferyJS;
    protected ridConstructor?: R;
    listeners!: CollectionListeners<this>;
    constructor(client: WolferyJS, api: ResClient, rid: string, validateItem: (item: T) => boolean, options?: ResCollectionModelOptions<T> & {
        ridConstructor?: R;
    }) {
        super(api, rid, validateItem, options);
        options = copy(options ?? {}, {
            ridConstructor: { type: "?function" }
        });
        Properties.of(this)
            .readOnly("client", client)
            .readOnly("ridConstructor", options.ridConstructor)
            .readOnly("listeners", new CollectionListeners(this));
    }

    protected override async _listen(on: boolean, changes = true): Promise<void> {
        await super._listen(on, changes);
        if (on) this.listeners.activate();
        else this.listeners.deactivate();
    }

    async fetch(...args: R["__typesOnlyArgs"]): Promise<T extends ResRef<infer V> ? V : T> {
        if (!this.ridConstructor) throw new Error("RID constructor is not defined");
        const arg = this.ridConstructor.names.reduce((acc, name, index) => {
            acc[name] = args[index];
            return acc;
        }, {} as Record<string, unknown>);
        const rid = this.ridConstructor(arg);
        return this.api.get<AnyRes>(rid) as T extends ResRef<infer V> ? V : T;
    }
}

export function enableCustomInspectForCollectionModels(): void {
    if (util.inspect.custom in BaseCollectionModel.prototype) return;
    Object.defineProperty(BaseCollectionModel.prototype, util.inspect.custom, {
        value(this: BaseCollectionModel, depth: number, inspectOptions: InspectOptions, inspect: typeof util.inspect): string {
            return inspect(ridOnlyClassAndList(this.constructor as typeof BaseCollectionModel, this.rid, this.list), inspectOptions);
        }
    });
}
