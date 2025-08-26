import BaseCollection from "./BaseCollection.js";

// do not edit the first line of the class comment
/**
 * The triggers for a character or puppet.
 * @resourceID CHARACTER_SETTINGS_TRIGGERS(core.char.{id}.settings.triggers)
 * @resourceID PUPPET_SETTINGS_TRIGGERS(core.char.{ctrl}.puppet.{puppet}.settings.triggers)
 */
export default class Triggers extends BaseCollection<Record<"key", string>> {}
