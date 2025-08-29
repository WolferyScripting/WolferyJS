import AreaChild from "./AreaChild.js";
import RoomChild from "./RoomChild.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { AreaChildrenProperties } from "../generated/models/types.js";
import type { ResClient } from "resclient-ts";

interface AreaChildren extends BaseCollectionModel<AreaChild | RoomChild>, AreaChildrenProperties {}
// do not edit the first line of the class comment
/**
 * The child areas of an area.
 * @resourceID {@link ResourceIDs.AREA_CHILDREN | AREA_CHILDREN}
 */
class AreaChildren extends BaseCollectionModel<AreaChild | RoomChild> implements AreaChildrenProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof AreaChild || item instanceof RoomChild);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("population"));
    }

    get areas(): Array<AreaChild> {
        return this.list.filter(child => child.type === "area") as Array<AreaChild>;
    }

    get rooms(): Array<RoomChild> {
        return this.list.filter(child => child.type === "room") as Array<RoomChild>;
    }
}

export default AreaChildren;
