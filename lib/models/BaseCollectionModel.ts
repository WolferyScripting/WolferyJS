import type WolferyJS from "../WolferyJS.js";
import {
    type ModelTypeUnion,
    type ResClient,
    ResCollectionModel,
    type ResModel,
    type ResModelOptions,
    type ResRef
} from "resclient-ts";

export default abstract class BaseCollectionModel<T extends ResModel | ResRef = ResModel | ResRef> extends ResCollectionModel<T> {
    protected client!: WolferyJS;
    constructor(client: WolferyJS, api: ResClient, rid: string, modelType: ModelTypeUnion<T> | Array<ModelTypeUnion<T>>, options?: ResModelOptions) {
        super(api, rid, modelType, options);
        Object.defineProperty(this, "client", {
            enumerable: false,
            value:      client
        });
    }
}
