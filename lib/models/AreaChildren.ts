import AreaChild from "./AreaChild.js";
import RoomChild from "./RoomChild.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { AreaChildrenProperties } from "../generated/models/types.js";
import { AreaChildrenDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

interface AreaChildren extends BaseCollectionModel<AreaChild | RoomChild>, AreaChildrenProperties {}
class AreaChildren extends BaseCollectionModel<AreaChild | RoomChild> implements AreaChildrenProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, [AreaChild, RoomChild], { definition: AreaChildrenDefinition });
    }

    get areas(): Array<AreaChild> {
        return this.list.filter(child => child.type === "area") as Array<AreaChild>;
    }

    get rooms(): Array<RoomChild> {
        return this.list.filter(child => child.type === "room") as Array<RoomChild>;
    }
}

export default AreaChildren;
