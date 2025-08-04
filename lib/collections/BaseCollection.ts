import type WolferyJS from "../WolferyJS.js";
import { type ResClient, ResCollection } from "resclient-ts";

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
}
