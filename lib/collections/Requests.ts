import BaseCollection from "./BaseCollection.js";
import type Request from "../models/Request.js";
import type WolferyJS from "../WolferyJS.js";
import { toID } from "../util/Util.js";
import type ResClient from "resclient-ts";

export default class Requests extends BaseCollection<Request> {
    constructor(client: WolferyJS, api: ResClient, rid: string) {
        super(client, api, rid, { idCallback: toID });
    }
}
