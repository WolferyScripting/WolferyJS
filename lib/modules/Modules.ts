import Admin from "./Admin.js";
import Builder from "./Builder.js";
import Core from "./Core.js";
import Helper from "./Helper.js";
import Moderator from "./Moderator.js";
import Overseer from "./Overseer.js";
import Staff from "./Staff.js";
import type WolferyJS from "../WolferyJS.js";

export default class Modules {
    admin!: Admin;
    builder!: Builder;
    core!: Core;
    helper!: Helper;
    moderator!: Moderator;
    overseer!: Overseer;
    staff!: Staff;
    constructor(client: WolferyJS) {
        this.admin = new Admin(client);
        this.builder = new Builder(client);
        this.core = new Core(client);
        this.helper = new Helper(client);
        this.moderator = new Moderator(client);
        this.overseer = new Overseer(client);
        this.staff = new Staff(client);
    }
}
