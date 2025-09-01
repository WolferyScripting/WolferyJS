import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { ProfileProperties } from "../generated/models/types.js";
import { ProfileDefinition } from "../generated/models/definitions.js";
import { type NameBasicResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

declare interface Profile extends BaseModel, ProfileProperties {}
// do not edit the first line of the class comment
/**
 * A character profile.
 * @resourceID {@link ResourceIDs.PROFILE | PROFILE}
 */
class Profile extends BaseModel implements ProfileProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: ProfileDefinition });
    }

    get avatarURL(): string | null {
        return this.avatar === "" ? null : `${this.client.fileURL}/core/char/avatar/${this.avatar}`;
    }

    get imageURL(): string | null {
        return this.image === "" ? null : `${this.client.fileURL}/core/char/img/${this.image}`;
    }

    /**
     * Delete this profile.
     * @calls {@link getCtrl} > {@link ControlledCharacter.deleteProfile}
     */
    async delete(): Promise<NameBasicResponse> {
        const ctrl = await this.getCtrl();
        return ctrl.deleteProfile(this.id);
    }

    /**
     * Get the controlled character this profile belongs to.
     * @calls {@link WolferyJS.findControlledCharacter}
     * @throws {@link NoControlledError} If a controlled character cannot be found.
     */
    async getCtrl(): Promise<ControlledCharacter> {
        return this.client.findControlledCharacter(ctrl => ctrl.profiles.hasKey(this.id), true);

    }

    /**
     * Set options for this profile.
     * @param options The options to set.
     * @calls {@link getCtrl} > {@link ControlledCharacter.setProfile}
     */
    async set(options: Commands.Controlled.SetProfileOptions): Promise<Profile> {
        const ctrl = await this.getCtrl();
        return ctrl.setProfile(this.id, options);
    }

    /**
     * Apply this profile.
     * @param safe If a check should be made to ensure the current character info is stored in a profile.
     * @calls {@link getCtrl} > {@link ControlledCharacter.useProfile}
     */
    async use(safe = true): Promise<Profile> {
        const ctrl = await this.getCtrl();
        return ctrl.useProfile(this.id, safe);
    }
}

export default Profile;
