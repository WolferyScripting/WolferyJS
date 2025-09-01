import BaseCollection from "./BaseCollection.js";
import type Profile from "../models/Profile.js";
import { toID } from "../util/Util.js";
import type WolferyJS from "../WolferyJS.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The profiles for a character.
 * @resourceID {@link ResourceIDs.PROFILES | PROFILES}
 */
export default class Profiles extends BaseCollection<Profile, typeof ResourceIDs.PROFILE> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.PROFILE
        });
    }

    get ctrlId(): string {
        return ResourceIDs.PROFILES.parts(this.rid).id;
    }

    /**
     * Create a profile based on the character's current attributes.
     * @param name The name of the profile.
     * @param key The key of the profile.
     * @calls {@link getCtrl} > {@link ControlledCharacter.createProfile}
     */
    async create(name: string, key: string): Promise<Profile> {
        const ctrl = await this.getCtrl();
        return ctrl.createProfile(name, key);
    }

    /**
     * Get the controlled character these profiles belong to.
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.getControlledCharacter(this.ctrlId, true);
    }
}
