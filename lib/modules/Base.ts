import type WolferyJS from "../WolferyJS.js";
import { Properties } from "resclient-ts";

export default abstract class Base {
    client!: WolferyJS;
    constructor(client: WolferyJS) {
        Properties.of(this)
            .readOnly("client", client);
    }
}
