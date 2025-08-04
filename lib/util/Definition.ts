/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
import { type ResModel, type PropertyDefinition, ResCollection, ResRef } from "resclient-ts";
import assert from "node:assert";
import { format } from "node:util";

interface DefinitionTypeMap {
    "?array": Array<unknown> | null;
    "?array[number]": Array<number> | null;
    "?array[string]": Array<string> | null;
    "?boolean": boolean | null;
    "?function": Function | null;
    "?number": number | null;
    "?object": object | null;
    "?string": string | null;
    "any": unknown;
    "array": Array<unknown>;
    "array[number]": Array<number>;
    "array[string]": Array<string>;
    "boolean": boolean;
    "function": Function;
    "number": number;
    "object": object;
    "string": string;
}

export default class Definition<O = {}> {
    private def: Record<string, PropertyDefinition> = {};
    static new(): Definition {
        return new Definition();
    }

    get type(): O {
        return undefined as O;
    }

    add<K extends string, OT extends PropertyDefinition["type"], T = DefinitionTypeMap[OT]>(key: K, type: OT, options?: Omit<PropertyDefinition, "type">): Definition<O & { [key in K]: T; }> {
        this.def[key] = { type, ...options };
        return this as Definition<O & { [key in K]: T; }>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addCollection<K extends string, T extends new(...args: Array<any>) => ResCollection, B extends boolean = false>(prop: K, klass: T, optional: B = false as B): Definition<O & { [key in K]: B extends true ? InstanceType<T> | null : InstanceType<T>; }> {
        return this.add(prop, optional ? "?object" : "object", {
            assert(value: unknown): void {
                if (optional && value === null) return;
                assert(value instanceof klass, `Expected instance of ${klass.name} for ${prop}, got ${format(value)}`);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addModel<K extends string, T extends new(...args: Array<any>) => ResModel, B extends boolean = false>(prop: K, klass: T, optional: B = false as B): Definition<O & { [key in K]: B extends true ? InstanceType<T> | null : InstanceType<T>; }> {
        return this.add(prop, optional ? "?object" : "object", {
            assert(value: unknown): void {
                if (optional && value === null) return;
                assert(value instanceof klass, `Expected instance of ${klass.name} for ${prop}, got ${format(value)}`);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addModelCollection<K extends string, T extends new(...args: Array<any>) => ResModel, B extends boolean = false>(prop: K, klass: T, optional: B = false as B): Definition<O & { [key in K]: B extends true ? ResCollection<InstanceType<T>> | null : ResCollection<InstanceType<T>>; }> {
        return this.add(prop, optional ? "?object" : "object", {
            assert(value: unknown): void {
                if (optional && value === null) return;
                assert(value instanceof ResCollection, `Expected instance of ResCollection for ${prop}, got ${format(value)}`);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addRef<K extends string, T extends new(...args: Array<any>) => ResModel, B extends boolean = false>(prop: K, klass: T, optional: B = false as B): Definition<O & { [key in K]: B extends true ? ResRef<InstanceType<T>> | null : ResRef<InstanceType<T>>; }> {
        return this.add(prop, optional ? "?object" : "object", {
            assert(value: unknown): void {
                if (optional && value === null) return;
                assert(value instanceof ResRef, `Expected instance of ResRef for ${prop}, got ${format(value)}`);
            }
        });
    }

    get(): Record<string, PropertyDefinition> {
        return this.def;
    }
}
