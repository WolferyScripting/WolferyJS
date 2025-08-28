/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import { type ListenerMethod } from "./CollectionListeners.js";
import BaseCollection from "../collections/BaseCollection.js";
import type BaseCollectionModel from "../models/BaseCollectionModel.js";
import type BaseModel from "../models/BaseModel.js";
import { Properties } from "resclient-ts";

export interface Listener<T extends BaseCollection<any> | BaseCollectionModel<any> = BaseCollection<any> | BaseCollectionModel<any>> {
    id?: string | symbol;
    offMethod: "off" | "resourceOff";
    onAdd: ListenerMethod<T>;
    onMethod: "on" | "resourceOn";
    onRemove: ListenerMethod<T>;
    target: T;
}

export default class ModelListeners<M extends BaseModel> {
    private listeners: Array<Listener> = [];
    private model!: M;
    active = false;
    constructor(model: M) {
        Properties.of(this)
            .readOnly("model", model)
            .readOnly("listeners", this.listeners);
    }

    private _listenAll(on: boolean): void {
        for (const listener of this.listeners) {
            this._listenOne(listener, on);
        }
    }

    private _listenOne(listener: Listener, on: boolean): void {
        listener.target.listeners.listenOrUnlisten(on, listener.onAdd, listener.onRemove);
    }

    /** Activate all listeners. */
    activate(): void {
        if (!this.active) {
            this.active = true;
            this._listenAll(true);
        }
    }

    /**
     * Add a listener for the `add` and `remove` events.
     * @param target The target collection.
     * @param onAdd The callback to invoke when an item is added.
     * @param onRemove The callback to invoke when an item is removed.
     * @param id An optional unique identifier for the listener, used to identify when removing.
     */
    add<T extends BaseCollection<any> | BaseCollectionModel<any>>(
        target: T,
        onAdd: ListenerMethod<T>,
        onRemove: ListenerMethod<T>,
        id?: string | symbol
    ): void {
        const onMethod = target instanceof BaseCollection ? "resourceOn" : "on";
        const offMethod = target instanceof BaseCollection ? "resourceOff" : "off";
        const listener: Listener<T> = {
            id,
            offMethod,
            onAdd,
            onMethod,
            onRemove,
            target
        };
        this.listeners.push(listener);
        if (this.active) this._listenOne(listener, true);
    }

    /**
     * Add or remove a listener based on a condition.
     * @param on Whether to add (true) or remove (false) the listener.
     * @param target The target collection.
     * @param onAdd The callback to invoke when an item is added.
     * @param onRemove The callback to invoke when an item is removed.
     * @param id An optional unique identifier for the listener, used to identify when removing.
     * @returns True if the listener was added, false if it was removed.
     */
    addOrRemove<T extends BaseCollection<any> | BaseCollectionModel<any>>(
        on: boolean,
        target: T,
        onAdd: ListenerMethod<T>,
        onRemove: ListenerMethod<T>,
        id?: string | symbol
    ): boolean {
        if (on) {
            this.add(target, onAdd, onRemove, id);
            return true;
        } else {
            this.remove(target, id);
            return false;
        }
    }

    /** Unlisten and remove all listeners. */
    clear(): void {
        if (this.active) this._listenAll(false);
        this.listeners.length = 0;
    }

    /** Unlisten all listeners. Does not remove them. */
    deactivate(): void {
        if (this.active) {
            this.active = false;
            this._listenAll(false);
        }
    }

    /**
     * Remove a listener.
     * @param target The target collection.
     * @param id The unique ID of a single listener to remove. Provided when adding the listener.
     */
    remove(target: BaseCollection<any> | BaseCollectionModel<any>, id?: string | symbol): void {
        const index = this.listeners.findIndex(listener => listener.target === target && listener.id === id);
        if (index !== -1) {
            const [listener] = this.listeners.splice(index, 1);
            if (listener && this.active) {
                this._listenOne(listener, false);
            }
        }
    }
}
