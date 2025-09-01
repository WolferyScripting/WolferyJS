import BaseCollection from "./BaseCollection.js";
import type Node from "../models/Node.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import ResourceIDs from "../generated/ResourceIDs.js";
import type ControlledCharacter from "../models/ControlledCharacter.js";
import type { ResClient } from "resclient-ts";

// do not edit the first line of the class comment
/**
 * The global teleport nodes.
 * @resourceID {@link ResourceIDs.NODES | NODES}
 */
export default class GlobalTeleports extends BaseCollection<Node, typeof ResourceIDs.NODE> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, {
            idCallback:     toID,
            ridConstructor: ResourceIDs.NODE
        });
    }

    /**
     * Create a global teleport node.
     * @param ctrl The controlled character creating the teleport node.
     * @param key The key for the teleport node.
     * @adminRoleRequired
     * @calls {@link AdminCommands.createTeleport} > {@link WolferyJS.waitForCached}
     */
    async create(ctrl: ControlledCharacter, key: string): Promise<Node> {
        return this.client.commands.admin.createTeleport(ctrl, key)
            .then(r => this.client.waitForCached<Node>(ResourceIDs.NODE({ id: r.node.id })));
    }

    getByKey(key: string): Node | undefined {
        return this.list.find(node => node.key === key);
    }
}
