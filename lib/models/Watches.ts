import type Watch from "./Watch.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { WatchesProperties } from "../generated/models/types.js";
import { WatchesDefinition } from "../generated/models/definitions.js";
import { type ResClient, ResRef } from "resclient-ts";

declare interface Watches extends BaseCollectionModel<ResRef<Watch>>, WatchesProperties {}
class Watches extends BaseCollectionModel<ResRef<Watch>> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, ResRef, { definition: WatchesDefinition });
    }
}

export default Watches;
