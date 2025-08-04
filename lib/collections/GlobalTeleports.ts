import BaseCollection from "./BaseCollection.js";
import type Node from "../models/Node.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type ResClient from "resclient-ts";

export default class GlobalTeleports extends BaseCollection<Node> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    getByKey(key: string): Node | undefined {
        return this.list.find(node => node.key === key);
    }
}
