import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { NodeProperties } from "../generated/models/types.js";
import { NodeDefinition } from "../generated/models/definitions.js";
import type { NameBasicResponse } from "../util/types.js";
import type Commands from "../util/commands.js";
import type { ResClient } from "resclient-ts";

// I really wish there were some way to distinguish global nodes and character nodes with just their data for different models
declare interface Node extends BaseModel, NodeProperties {}
// do not edit the first line of the class comment
/**
 * A teleportation node.
 * @resourceID {@link ResourceIDs.NODE | NODE}
 */
class Node extends BaseModel implements NodeProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: NodeDefinition });
    }

    /**
     * Delete this teleport node. If the node is global, {@link deleteGlobal} must be used instead.
     */
    async delete(): Promise<null> {
        const ctrl = await this.getCtrl();
        if (!ctrl) throw new Error(`Node ${this.rid} is not a character node`);
        return ctrl.removeTeleport(this.id);
    }

    /**
     * Delete this global teleport node.
     * @param ctrl The controlled character to delete the global teleport node with.
     * @adminRoleRequired
     */
    async deleteGlobal(ctrl: string | ControlledCharacter): Promise<NameBasicResponse> {
        return this.client.commands.admin.deleteTeleport(ctrl, this.id);
    }

    /**
     * Get the controlled character that owns this node. If null, the node is global.
     */
    async getCtrl(): Promise<ControlledCharacter | null> {
        return this.client.findControlledCharacter(c => c.nodes.hasKey(this.id));
    }

    // global teleport nodes don't seem to have an edit function?
    /**
     * Set the attributes of this teleport node.
     * @param options The options to set.
     */
    async set(options: Commands.Controlled.SetTeleportOptions): Promise<null> {
        const ctrl = await this.getCtrl();
        if (!ctrl) throw new Error(`Node ${this.rid} is not a character node`);
        return this.client.commands.controlled.setTeleport(ctrl, this.id, options);
    }

    teleport(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.nodeTeleport(this.id);
    }
}

export default Node;
