import type WolferyJS from "../WolferyJS.js";
import {
    type AnyObject,
    ResModel,
    update,
    type ResClient,
    type ResModelOptions
} from "resclient-ts";

export default abstract class NonResModel<T extends AnyObject = AnyObject> {
    protected _props = {} as T;
    protected client!: WolferyJS;
    api!: ResClient;
    constructor(client: WolferyJS, api: ResClient, data: T, options?: ResModelOptions) {
        update(this, options ?? {}, {
            definition: { type: "?object", property: "_definition" }
        });
        Object.defineProperties(this, {
            client: {
                enumerable: false,
                writable:   false,
                value:      client
            },
            api: {
                enumerable: false,
                writable:   false,
                value:      api
            },
            _props: {
                enumerable: false,
                writable:   false,
                value:      {}
            },
            _definition: {
                enumerable: false
            }
        });
        ResModel.prototype.update.call(this, data);
    }

    get props(): T {
        return this._props;
    }
}
