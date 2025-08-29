import type PlayerMailMessage from "./PlayerMailMessage.js";
import BaseCollectionModel from "./BaseCollectionModel.js";
import type WolferyJS from "../WolferyJS.js";
import { type ResClient, ResRef } from "resclient-ts";

// @TODO
// do not edit the first line of the class comment
/**
 * Unread mail.
 * @resourceID {@link ResourceIDs.UNREAD_MAIL | UNREAD_MAIL}
 */
class UnreadMail extends BaseCollectionModel<ResRef<PlayerMailMessage>> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, item => item instanceof ResRef);
    }

    protected override async _listen(on: boolean): Promise<void> {
        await super._listen(on, this.client.anyTracked("mail"));
    }

    async fetchAll(): Promise<void> {
        for (const ref of this.list) {
            await ref.get();
        }
    }
}

export default UnreadMail;
