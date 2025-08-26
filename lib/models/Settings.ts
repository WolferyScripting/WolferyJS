import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { SettingsProperties } from "../generated/models/types.js";
import { SettingsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Settings extends BaseModel, SettingsProperties {}
// do not edit the first line of the class comment
/**
 * The settings for a character or puppet.
 * @resourceID CHARACTER_SETTINGS(core.char.{id}.settings)
 * @resourceID PUPPET_SETTINGS(core.char.{ctrl}.puppet.{puppet}.settings)
 */
class Settings extends BaseModel implements SettingsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: SettingsDefinition });
    }
}

export default Settings;
