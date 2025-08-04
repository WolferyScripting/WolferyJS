import Tag from "./Tag.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import type { CharacterTagsProperties } from "../generated/models/types.js";
import { CharacterTagsDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface CharacterTags extends BaseCollectionModel<Tag>, CharacterTagsProperties {}
class CharacterTags extends BaseCollectionModel<Tag> implements CharacterTagsProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, Tag, { definition: CharacterTagsDefinition });
    }

    get disliked(): Array<Tag> {
        return Object.entries(this.props as Record<string, Tag>).filter(([key]) => key.split("_")[1] === "dislike").map(([,value]) => value);
    }

    get liked(): Array<Tag> {
        return Object.entries(this.props as Record<string, Tag>).filter(([key]) => key.split("_")[1] === "like").map(([,value]) => value);
    }

    /**
     * Add a tag to the character.
     * @command `add tag`
     * @param tag The tag to add.
     * @param type The type, `like` or `dislike`.
     */
    async add(tag: string, type: "like" | "dislike"): Promise<null> {
        return this.set({ [tag]: type });
    }

    /**
     * Create a custom tag.
     * @param options The options for the tag.
     */
    async create(options: Commands.CharacterTags.CreateOptions): Promise<Tag> {
        return this.call<Tag>("create", options);
    }

    /**
     * Remove a tag from the character.
     * @command `remove tag`
     * @param tag The tag to remove.
     */
    async remove(tag: string): Promise<null> {
        return this.set({ [tag]: null });
    }

    /**
     * Set the tags for the character.
     * @param options An object of tag id to `like`, `dislike`, or `null`. Current tags do not need to be provided.
     */
    async set(options: Record<string, "like" | "dislike" | null>): Promise<null> {
        return this.call("setTags", options);
    }
}

export default CharacterTags;
