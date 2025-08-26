import BaseModel from "./BaseModel.js";
import type WolferyJS from "../WolferyJS.js";
import type { ProfileProperties } from "../generated/models/types.js";
import { ProfileDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Profile extends BaseModel, ProfileProperties {}
// do not edit the first line of the class comment
/**
 * A character profile.
 * @resourceID PROFILE(core.profile.{id})
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
}

export default Profile;
