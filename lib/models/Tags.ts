import Tag from "./Tag.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { CollectionModelAddRemove, ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The globally available tags.
 * @resourceID TAGS(tag.tags)
 */
class Tags extends BaseCollectionModel<Tag> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, Tag);
    }

    private _onAdd(data: CollectionModelAddRemove<Tag>): void {
        this.client.emit("tags.add", data.item);
    }

    private _onRemove(data: CollectionModelAddRemove<Tag>): void {
        this.client.emit("tags.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}

export default Tags;
