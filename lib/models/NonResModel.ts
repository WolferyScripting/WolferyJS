import type WolferyJS from "../WolferyJS.js";
import {
    type AnyObject,
    ResModel,
    update,
    type ResClient,
    type ResModelOptions,
    Properties
} from "resclient-ts";

export default abstract class NonResModel<T extends AnyObject = AnyObject> {
    protected _props!: T;
    protected client!: WolferyJS;
    api!: ResClient;
    constructor(client: WolferyJS, api: ResClient, data: T, options: ResModelOptions = {}) {
        update(this, options, {
            definition: { type: "?object", property: "_definition" }
        });
        Properties.of(this)
            .readOnly("client", client)
            .readOnly("api", api)
            .readOnly("_props", {});
        ResModel.prototype.update.call(this, data);
    }

    get props(): T {
        return this._props;
    }
}
