import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ImageProperties } from "../generated/models/types.js";
import { ImageDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Image extends BaseModel, ImageProperties {}
// do not edit the first line of the class comment
/**
 * An image.
 * @resourceID {@link ResourceIDs.AREA_IMAGE | AREA_IMAGE}
 * @resourceID {@link ResourceIDs.CHARACTER_IMAGE | CHARACTER_IMAGE}
 * @resourceID {@link ResourceIDs.ROOM_IMAGE | ROOM_IMAGE}
 */
class Image extends BaseModel implements ImageProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ImageDefinition });
    }

    get url(): string {
        return this.href;
    }
}

export default Image;
