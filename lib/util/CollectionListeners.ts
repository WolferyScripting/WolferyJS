/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import BaseCollection from "../collections/BaseCollection.js";
import type BaseCollectionModel from "../models/BaseCollectionModel.js";
import { type CollectionAddRemove, type CollectionModelAddRemove, Properties } from "resclient-ts";

export type ListenerMethod<C extends BaseCollectionModel<any> | BaseCollection<any>> = (
    this: void,
    item: C extends BaseCollection<infer V>
        ? CollectionAddRemove<V>
        : C extends BaseCollectionModel<infer V>
            ? CollectionModelAddRemove<V>
            : never
) => void;

export interface Listener<C extends BaseCollectionModel<any> | BaseCollection<any>> {
    id?: string | symbol;
    offMethod: "off" | "resourceOff";
    onAdd: ListenerMethod<C>;
    onMethod: "on" | "resourceOn";
    onRemove: ListenerMethod<C>;
}

export default class CollectionListeners<C extends BaseCollectionModel<any> | BaseCollection<any>> {
    private collection!: C;
    private listeners!: Array<Listener<C>>;
    active = false;
    constructor(collection: C) {
        Properties.of(this)
            .readOnly("collection", collection)
            .readOnly("listeners", []);
    }

    private _listenAll(on: boolean): void {
        for (const listener of this.listeners) {
            this._listenOne(listener, on);
        }
    }

    private _listenOne(listener: Listener<C>, on: boolean): void {
        if (on) {
            this.collection[listener.onMethod]("add", listener.onAdd);
            this.collection[listener.onMethod]("remove", listener.onRemove);
        } else {
            this.collection[listener.offMethod]("add", listener.onAdd);
            this.collection[listener.offMethod]("remove", listener.onRemove);
        }
    }

    /** Activate all listeners. */
    activate(): void {
        if (!this.active) {
            this.active = true;
            this._listenAll(true);
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
     * Add a listener for the `add` and `remove` events.
     * @param onAdd The callback to invoke when an item is added.
     * @param onRemove The callback to invoke when an item is removed.
     * @param id An optional unique identifier for the listener, used to identify when removing.
     */
    listen(
        onAdd: ListenerMethod<C>,
        onRemove: ListenerMethod<C>,
        id?: string | symbol
    ): void {
        const onMethod = this.collection instanceof BaseCollection ? "resourceOn" : "on";
        const offMethod = this.collection instanceof BaseCollection ? "resourceOff" : "off";
        const listener: Listener<C> = {
            id,
            offMethod,
            onAdd,
            onMethod,
            onRemove
        };
        this.listeners.push(listener);
        if (this.active) this._listenOne(listener, true);
    }

    /**
     * Add or remove a listener based on a condition.
     * @param on Whether to add (true) or remove (false) the listener.
     * @param onAdd The callback to invoke when an item is added.
     * @param onRemove The callback to invoke when an item is removed.
     * @param id An optional unique identifier for the listener, used to identify when removing.
     * @returns True if the listener was added, false if it was removed.
     */
    listenOrUnlisten(
        on: boolean,
        onAdd: ListenerMethod<C>,
        onRemove: ListenerMethod<C>,
        id?: string | symbol
    ): boolean {
        if (on) {
            this.listen(onAdd, onRemove, id);
            return true;
        } else {
            this.unlisten(id);
            return false;
        }
    }

    /**
     * Remove a listener.
     * @param id The unique ID of a single listener to remove. Provided when adding the listener.
     */
    unlisten(id?: string | symbol): void {
        if (id) {
            const index = this.listeners.findIndex(listener => listener.id === id);
            if (index !== -1) {
                const [listener] = this.listeners.splice(index, 1);
                if (listener && this.active) {
                    this._listenOne(listener, false);
                }
            }
        } else {
            this.clear();
        }
    }
}
