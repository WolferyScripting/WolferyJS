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

    protected override async _listen(on: boolean, changes = true): Promise<void> {
        await super._listen(on, changes);
        if (on) this.listeners.activate();
        else this.listeners.deactivate();
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
