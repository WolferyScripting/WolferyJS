import BaseCollection from "./BaseCollection.js";
import type Exit from "../models/Exit.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The exits in a room.
 * @resourceID {@link ResourceIDs.EXITS | EXITS}
 */
export default class Exits extends BaseCollection<Exit> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
        console.log("construct exits", this.rid);
    }

    // @TODO
    async getHidden(): Promise<unknown> {
        return this.api.get(`${this.rid}.hidden`);
    }

    override async init(data?: Array<Exit> | undefined): Promise<this> {
        await super.init(data);
        console.log("init exits", this.rid);
        return this;
    }
}
