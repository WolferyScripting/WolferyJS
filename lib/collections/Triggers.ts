import BaseCollection from "./BaseCollection.js";

// do not edit the first line of the class comment
/**
 * The triggers for a character or puppet.
 * @resourceID {@link ResourceIDs.CHARACTER_SETTINGS_TRIGGERS | CHARACTER_SETTINGS_TRIGGERS}
 * @resourceID {@link ResourceIDs.PUPPET_SETTINGS_TRIGGERS | PUPPET_SETTINGS_TRIGGERS}
 */
export default class Triggers extends BaseCollection<Record<"key", string>> {}
