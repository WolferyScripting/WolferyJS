import Character from "./Character.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { AwakeCharactersProperties } from "../generated/models/types.js";
import { AwakeCharactersDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface AwakeCharacters extends BaseCollectionModel<Character>, AwakeCharactersProperties {}
class AwakeCharacters extends BaseCollectionModel<Character> implements AwakeCharactersProperties {
    private onAdd = this._onAdd.bind(this);
    private onRemove = this._onRemove.bind(this);
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, Character, { definition: AwakeCharactersDefinition });
    }

    private _onAdd(char: Character): void {
        this.client.emit("awakeCharactersAdd", char);
    }

    private _onRemove(char: Character): void {
        this.client.emit("awakeCharactersRemove", char);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on);
        const m = on ? "on" : "off";
        this[m]("add", this.onAdd);
        this[m]("remove", this.onRemove);
    }
}

export default AwakeCharacters;
