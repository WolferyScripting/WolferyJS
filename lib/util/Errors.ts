/** @module Errors */

/** An error that is thrown when we encounter an error, and no `error` listeners are present. */
export class UncaughtError extends Error {
    override name = "UncaughtError";
    constructor(error: Error | string) {
        super("Uncaught 'error' event", { cause: error });
        this.stack = undefined;
    }
}

export class UnsubscribeError extends Error {
    override name = "UnsubscribeError";
    constructor() {
        super("Client was forcefully unsubscribed, and no listeners were registered.");
    }
}
