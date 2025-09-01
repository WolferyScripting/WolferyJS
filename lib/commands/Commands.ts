import AdminCommands from "./Admin.js";
import BuilderCommands from "./Builder.js";
import CoreCommands from "./Core.js";
import HelperCommands from "./Helper.js";
import ControlledCommands from "./Controlled.js";
import ModeratorCommands from "./Moderator.js";
import OverseerCommands from "./Overseer.js";
import StaffCommands from "./Staff.js";
import PlayerCommands from "./Player.js";
import MiscCommands from "./Misc.js";
import type WolferyJS from "../WolferyJS.js";

export default class Commands {
    admin!: AdminCommands;
    builder!: BuilderCommands;
    controlled!: ControlledCommands;
    core!: CoreCommands;
    helper!: HelperCommands;
    misc!: MiscCommands;
    moderator!: ModeratorCommands;
    overseer!: OverseerCommands;
    player!: PlayerCommands;
    staff!: StaffCommands;
    constructor(client: WolferyJS) {
        this.admin = new AdminCommands(client);
        this.builder = new BuilderCommands(client);
        this.controlled = new ControlledCommands(client);
        this.core = new CoreCommands(client);
        this.helper = new HelperCommands(client);
        this.misc = new MiscCommands(client);
        this.moderator = new ModeratorCommands(client);
        this.overseer = new OverseerCommands(client);
        this.player = new PlayerCommands(client);
        this.staff = new StaffCommands(client);
    }
}
