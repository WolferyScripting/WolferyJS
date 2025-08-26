import BaseCollection from "./BaseCollection.js";
import type Node from "../models/Node.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type { ResClient, CollectionAddRemove } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The global teleport nodes.
 * @resourceID NODES(core.nodes)
 */
export default class GlobalTeleports extends BaseCollection<Node> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }

    private _onAdd(data: CollectionAddRemove<Node>): void {
        this.client.emit("globalTeleports.add", data.item);
    }

    private _onRemove(data: CollectionAddRemove<Node>): void {
        this.client.emit("globalTeleports.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "resourceOn" : "resourceOff";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }

    getByKey(key: string): Node | undefined {
        return this.list.find(node => node.key === key);
    }
}
