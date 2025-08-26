import WolferyJS from "../lib/WolferyJS.js";
import ResourceIDs from "../lib/generated/ResourceIDs.js";
import { expect } from "chai";
import { Server, WebSocket } from "mock-socket";
import { type AnyObject, ProtocolHelper } from "resclient-ts";
import { createHash, createHmac, randomBytes } from "node:crypto";

const username = "abc";
const password = "123";
const HMACKey = "TheStoryStartsHere";
const passwordHash = createHash("sha256").update(password).digest("base64");
const passwordHMAC = createHmac("sha256", HMACKey).update(password).digest("base64");
const rid = randomBytes(8).toString("hex");

class WebSocketServer {
    messages: Array<string> = [];
    server: Server;
    constructor(url: string) {
        this.server = Server.of(url);
        this.server.on("connection", socket => {
            socket.on("message", data => {
                this.messages.push(String(data));
                const d = JSON.parse(String(data)) as { id: number; method: string; params: AnyObject; };
                switch (d.method) {
                    case "version": {
                        socket.send(JSON.stringify({ result: { protocol: d.params.protocol as string }, id: d.id }));
                        break;
                    }
                    case "auth.auth.login": {
                        socket.send(JSON.stringify({ result: { payload: null }, id: d.id }));
                        break;
                    }
                    case "call.auth.getUser": {
                        socket.send(JSON.stringify({
                            result: {
                                rid:    ResourceIDs.USER({ id: rid }),
                                models: {
                                    [ResourceIDs.IDENTITY({ id: rid })]: { id: rid },
                                    [ResourceIDs.USER({ id: rid })]:     { id: rid }
                                }
                            },
                            id: d.id
                        }));
                        break;
                    }
                    case "call.core.getPlayer": {
                        socket.send(JSON.stringify({
                            result: {
                                rid:    ResourceIDs.PLAYER({ id: rid }),
                                models: {
                                    [ResourceIDs.PLAYER({ id: rid })]:           { id: rid },
                                    [ResourceIDs.MUTED_CHARACTERS({ id: rid })]: {}
                                },
                                collections: {
                                    [ResourceIDs.OWNED_CHARACTERS({ id: rid })]:      [],
                                    [ResourceIDs.CONTROLLED_CHARACTERS({ id: rid })]: [],
                                    [ResourceIDs.PUPPETS({ id: rid })]:               []
                                }
                            },
                            id: d.id
                        }));
                        break;
                    }
                }
            });
        });
    }

    async waitForMessage(method?: string): Promise<string> {
        return new Promise(resolve => {
            this.server.on("connection", socket => {
                socket.on("message", data => {
                    if (!method || (JSON.parse(String(data)) as { method: string; }).method === method) {
                        resolve(String(data));
                    }
                });
            });
        });
    }
}

describe("WebSocket", () => {
    const url = "ws://localhost:1234";
    let server: WebSocketServer, client: WolferyJS;
    beforeEach(() => {
        server = new WebSocketServer(url);
        client = new WolferyJS({
            wsFactory:      (): never => new WebSocket(url) as never,
            authentication: {
                type: "password",
                username,
                password
            },
            fetch: {
                startup: false
            }
        });
    });

    afterEach(async() => {
        await client.disconnect();
        server.server.close();
    });

    it("should send protocol on connect", done => {
        void server.waitForMessage("version")
            .then(message => {
                expect(message).to.eq(JSON.stringify({ id: 1, method: "version", params: { protocol: ProtocolHelper.CURRENT } }));
                done();
            });
        void client.connect(true);
    });

    it("should authenticate", done => {
        void server.waitForMessage("auth.auth.login")
            .then(message => {
                expect(message).to.eq(JSON.stringify({ id: 2, method: "auth.auth.login", params: { name: username, pass: passwordHash, hash: passwordHMAC } }));
                done();
            });
        void client.connect(true);
    });

    it("should call getUser", done => {
        void server.waitForMessage("call.auth.getUser")
            .then(message => {
                expect(message).to.eq(JSON.stringify({ id: 3, method: "call.auth.getUser", params: undefined }));
                done();
            });
        void client.connect(true);
    });

    it("should call getPlayer", done => {
        void server.waitForMessage("call.core.getPlayer")
            .then(message => {
                expect(message).to.eq(JSON.stringify({ id: 4, method: "call.core.getPlayer", params: undefined }));
                done();
            });
        void client.connect(true);
    });
});
