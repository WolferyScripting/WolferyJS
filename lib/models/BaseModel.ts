import type WolferyJS from "../WolferyJS.js";
import { ridOnlyClass } from "../util/Util.js";
import { type AnyObject, type ResClient, ResModel, type ResModelOptions } from "resclient-ts";
import util, { type InspectOptions } from "node:util";

export default class BaseModel extends ResModel {
    protected client!: WolferyJS;
    constructor(client: WolferyJS, api: ResClient, rid: string, options?: ResModelOptions) {
        super(api, rid, options);
        Object.defineProperty(this, "client", {
            enumerable: false,
            value:      client
        });
    }

    override update(props: AnyObject, reset = false): AnyObject | null {
        if (!props) {
            return null;
        }

        if (this._definition) {
            const missing: Array<string> = [];
            for (const prop in props) {
                if (!(prop in this._definition)) {
                    missing.push(prop);
                }
            }

            if (missing.length !== 0) {
                this.client.emit("missingProperties", this, missing, props);
            }
        }

        return super.update(props, reset);
    }

    [util.inspect.custom](depth: number, inspectOptions: InspectOptions, inspect: typeof util.inspect): string {
        return inspect(ridOnlyClass(this.constructor as typeof BaseModel, this.rid), inspectOptions);
    }
}
