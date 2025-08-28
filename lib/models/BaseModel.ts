import type WolferyJS from "../WolferyJS.js";
import { ridOnlyClass } from "../util/Util.js";
import ModelListeners from "../util/ModelListeners.js";
import {
    type AnyObject,
    Properties,
    type ResClient,
    ResModel,
    type ResModelOptions
} from "resclient-ts";
import util, { type InspectOptions } from "node:util";

export default class BaseModel extends ResModel {
    protected client!: WolferyJS;
    listeners!: ModelListeners<this>;
    constructor(client: WolferyJS, api: ResClient, rid: string, options?: ResModelOptions) {
        super(api, rid, options);
        Properties.of(this)
            .readOnly("client", client)
            .readOnly("listeners", new ModelListeners(this));
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        if (on) this.listeners.activate();
        else this.listeners.deactivate();
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
}


export function enableCustomInspectForModels(): void {
    if (util.inspect.custom in BaseModel.prototype) return;
    Object.defineProperty(BaseModel.prototype, util.inspect.custom, {
        value(this: BaseModel, depth: number, inspectOptions: InspectOptions, inspect: typeof util.inspect): string {
            return inspect(ridOnlyClass(this.constructor as typeof BaseModel, this.rid), inspectOptions);
        }
    });
}
