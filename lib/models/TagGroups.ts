import BaseCollectionModel from "./BaseCollectionModel.js";
import TagGroup from "./TagGroup.js";
import type WolferyJS from "../WolferyJS.js";
import type { CollectionModelAddRemove, ResClient } from "resclient-ts";

class TagGroups extends BaseCollectionModel<TagGroup> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, TagGroup);
    }

    private _onAdd(data: CollectionModelAddRemove<TagGroup>): void {
        this.client.emit("tagGroups.add", data.item);
    }

    private _onRemove(data: CollectionModelAddRemove<TagGroup>): void {
        this.client.emit("tagGroups.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}

export default TagGroups;
