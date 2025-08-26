import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ImageProperties } from "../generated/models/types.js";
import { ImageDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Image extends BaseModel, ImageProperties {}
// do not edit the first line of the class comment
/**
 * An image.
 * @resourceID AREA_IMAGE(core.area.img.{id})
 * @resourceID CHARACTER_IMAGE(core.char.img.{id})
 * @resourceID ROOM_IMAGE(core.room.img.{id})
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
