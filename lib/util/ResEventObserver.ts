import { Debug } from "./Debug.js";
import type WolferyJS from "../WolferyJS.js";
import type { AnyObject } from "resclient-ts";

interface ResEventObserverOptions<T = AnyObject> {
    once?: boolean;
    callback?(this: void, data: T): void;
    filter?(this: void, data: T): boolean;
}

class ResEventObserver<T = AnyObject> {
    private callback?: (this: void, data: T) => void;
    private client!: WolferyJS;
    private filter?: (this: void, data: T) => boolean;
    private onEvent = this._onEvent.bind(this);
    private onUnsubscribe = this._onUnsubscribe.bind(this);
    private waitPromise: { promise: Promise<T>; reject(this: void, err: unknown): void; resolve(this: void, data: T): void; } | null = null;
    done: boolean;
    event: string;
    list: Array<T>;
    once: boolean;
    rid: string;
    constructor(client: WolferyJS, rid: string, event: string, options: ResEventObserverOptions<T> = {}) {
        Object.defineProperties(this, {
            callback:      { enumerable: false, value: options.callback },
            client:        { enumerable: false, value: client },
            filter:        { enumerable: false, value: options.filter },
            onEvent:       { enumerable: false },
            onUnsubscribe: { enumerable: false },
            waitPromise:   { enumerable: false }
        });
        this.done = false;
        this.event = event;
        this.list = [];
        this.once = options.once ?? false;
        this.rid = rid;
        this._listen(true);
    }

    private _listen(on: boolean): void {
        Debug("client:ResEventObserver", `Listening to ${this.rid} for event ${this.event} (${on ? "on" : "off"})`);
        const cb = on ? "resourceOn" : "resourceOff";
        this.client.api[cb](this.rid, this.event, this.onEvent);
        this.client.api[cb](this.rid, "unsubscribe", this.onUnsubscribe);
    }

    private _onEvent(data: T): void {
        if (this.filter && !this.filter.call(undefined, data)) return;
        this.callback?.call(undefined, data);
        this.list.push(data);
        if (this.once) {
            this.done = true;
            this._listen(false);
        }
        this._resolvePromise();
    }

    private _onUnsubscribe(): void {
        this.done = true;
        this._listen(false);
        this._resolvePromise();
    }

    private _resolvePromise(): void {
        if (!this.waitPromise) return;
        const { resolve, reject } = this.waitPromise;
        this.waitPromise = null;
        if (this.list.length === 0) {
            reject(new Error(`EventObserver for ${this.rid} has no data.`));
        } else {
            resolve(this.list[0]!);
        }
    }

    end(): void {
        if (this.done) return;
        this.done = true;
        this._listen(false);
        this._resolvePromise();
    }

    async get(timeout?: number): Promise<T> {
        if (this.done) {
            if (this.list.length !== 0) {
                return this.list[0]!;
            }
            throw new Error(`EventObserver for ${this.rid} has no data.`);
        }
        let promise: Promise<T>;
        if (this.waitPromise) {
            promise = this.waitPromise.promise;
        } else {
            promise = new Promise<T>((resolve, reject) => {
                this.waitPromise = {
                    promise,
                    reject,
                    resolve
                };
            });
        }

        if (timeout) {
            return new Promise<T>((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error(`EventObserver timed out after ${timeout}ms`));
                }, timeout);
                promise.then(resolve).catch(reject).finally(() => clearTimeout(timer));
            });
        }
        return promise;
    }
}

export default ResEventObserver;
