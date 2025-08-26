import BaseCollectionModel from "./BaseCollectionModel.js";
import CharacterMin from "./CharacterMin.js";
import type WolferyJS from "../WolferyJS.js";
import type { CollectionModelAddRemove, ResClient } from "resclient-ts";

class MutedCharacters extends BaseCollectionModel<CharacterMin>  {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, CharacterMin);
    }

    private _onAdd(data: CollectionModelAddRemove<CharacterMin>): void {
        this.client.emit("mutedCharacters.add", data.item);
    }

    private _onRemove(data: CollectionModelAddRemove<CharacterMin>): void {
        this.client.emit("mutedCharacters.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}

export default MutedCharacters;
