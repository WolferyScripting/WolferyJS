import BaseCollectionModel from "./BaseCollectionModel.js";
import type Character from "./Character.js";
import CustomTag from "./CustomTag.js";
import GlobalTag from "./GlobalTag.js";
import type WolferyJS from "../WolferyJS.js";
import type Commands from "../util/commands.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type { Tag } from "../generated/models/types.js";
import type { TagPref } from "../util/types.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The tags of a character.
 * @resourceID {@link ResourceIDs.CHARACTER_TAGS | CHARACTER_TAGS}
 */
class CharacterTags extends BaseCollectionModel<Tag, typeof ResourceIDs.TAG> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof CustomTag || item instanceof GlobalTag, {
            ridConstructor: ResourceIDs.TAG
        });
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("characterTags"));
    }

    get charId(): string {
        return ResourceIDs.CHARACTER_TAGS.parts(this.rid).id;
    }

    get disliked(): Array<Tag> {
        return Object.entries(this.props as Record<string, Tag>).filter(([key]) => key.split("_")[1] === "dislike").map(([,value]) => value);
    }

    get liked(): Array<Tag> {
        return Object.entries(this.props as Record<string, Tag>).filter(([key]) => key.split("_")[1] === "like").map(([,value]) => value);
    }

    /**
     * Add a tag to the character.
     * @param tag The tag to add.
     * @param type The type, `like` or `dislike`.
     * @characterOwnershipRequired
     * @calls {@link set}
     */
    async add(tag: string, type: TagPref): Promise<null> {
        return this.set({ [tag]: type });
    }

    /**
     * Create a custom tag.
     * @param options The options for the tag.
     * @characterOwnershipRequired
     * @calls {@link ControlledCommands.createTag}
     */
    async create(options: Commands.CharacterTags.CreateOptions): Promise<Tag> {
        return this.client.commands.controlled.createTag(this.charId, options);
    }

    /**
     * Get the character.
     * @calls {@link MiscCommands.getChar}
     */
    async getChar(): Promise<Character> {
        return this.client.commands.misc.getChar(this.charId);
    }

    /**
     * Remove a tag from the character.
     * @param tag The tag to remove.
     * @characterOwnershipRequired
     * @calls {@link set}
     */
    async remove(tag: string): Promise<null> {
        return this.set({ [tag]: null });
    }

    /**
     * Set the tags for the character.
     * @param options An object of tag id to `like`, `dislike`, or `null`. Current tags do not need to be provided.
     * @characterOwnershipRequired
     * @calls {@link ControlledCommands.setTags}
     */
    async set(options: Record<string, TagPref | null>): Promise<null> {
        return this.client.commands.controlled.setTags(this.charId, options);
    }
}

export default CharacterTags;
