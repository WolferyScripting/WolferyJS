import Character from "./Character.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { CollectionModelAddRemove, ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The awake characters in the realm.
 */
class AwakeCharacters extends BaseCollectionModel<Character> {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, Character);
    }

    private _onAdd(data: CollectionModelAddRemove<Character>): void {
        this.client.emit("awakeCharacters.add", data.item);
    }

    private _onRemove(data: CollectionModelAddRemove<Character>): void {
        this.client.emit("awakeCharacters.remove", data.item);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}

export default AwakeCharacters;
