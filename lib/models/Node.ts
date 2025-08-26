import BaseModel from "./BaseModel.js";
import type ControlledCharacter from "./ControlledCharacter.js";
import type WolferyJS from "../WolferyJS.js";
import type { NodeProperties } from "../generated/models/types.js";
import { NodeDefinition } from "../generated/models/definitions.js";
import type { ResClient } from "resclient-ts";

declare interface Node extends BaseModel, NodeProperties {}
// do not edit the first line of the class comment
/**
 * A teleportation node.
 */
class Node extends BaseModel implements NodeProperties {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { definition: NodeDefinition });
    }

    teleport(ctrl: ControlledCharacter): Promise<null> {
        return ctrl.nodeTeleport(this.id);
    }
}

export default Node;
