import { type Collections, CollectionsSchema, type Models, ModelsSchema } from "./schema.js";
import { Ajv } from "ajv";
import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type Resource<T extends "collection" | "model"> = {
    args: Array<string>;
    matcher: string;
    name: string;
    raw: string;
} & {
    [K in T]: string;
};

export async function getCollections(): Promise<{ resources: Array<Resource<"collection">>; schema: Collections;}> {
    const collections = JSON.parse(await readFile(new URL("collections.json", import.meta.url), "utf8")) as Collections;
    const ajv = new Ajv();
    const collectionsValid = ajv.validate(CollectionsSchema, collections);
    if (!collectionsValid) {
        console.log("Failed to validate collections:");
        console.error(ajv.errors);
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }

    const resources: Array<Resource<"collection">> = [];

    for (const collection of collections) {
        resources.push(...idsToResources(Array.from(collection.id), collection.name, "collection"));
    }

    return { resources, schema: collections };
}

export async function getModels(): Promise<{ resources: Array<Resource<"model">>; schema: Models; }> {
    const models = JSON.parse(await readFile(new URL("models.json", import.meta.url), "utf8")) as Models;
    const ajv = new Ajv();
    const modelsValid = ajv.validate(ModelsSchema, models);
    if (!modelsValid) {
        console.log("Failed to validate models:");
        console.error(ajv.errors);
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    }

    const resources: Array<Resource<"model">> = [];

    for (const model of models) {
        resources.push(...idsToResources(Array.from(model.id), model.name, "model"));
    }

    return { resources, schema: models };
}

function idsToResources<T extends "collection" | "model">(ids: Array<string>, name: string, type: T): Array<Resource<T>> {
    const resources: Array<Resource<T>> = [];

    const missingRid = ids.filter(id => !(id.includes("(") && id.includes(")")));
    if (missingRid.length !== 0) {
        console.log(`Missing rid ${name}: ${missingRid.join(", ")}`);
        for (const id of missingRid) ids.splice(ids.indexOf(id), 1);
    }

    for (const id of ids) {
        const idName = id.slice(0, id.lastIndexOf("(")).trim();
        const rid = id.slice(id.lastIndexOf("(") + 1, id.lastIndexOf(")"));
        const arg = rid.match(/\{([^}]+)\}/g) ?? [];
        if (arg.length === 0) {
            resources.push({ args: [], matcher: rid.replaceAll(/\{([^}]+)\}/g, "*"), name: idName, raw: rid, [type]: name } as never);
        } else {
            resources.push({ args: arg.map(a => a.slice(1, -1)), matcher: rid.replaceAll(/\{([^}]+)\}/g, "*"), name: idName, raw: rid, [type]: name } as never);
        }
    }

    return resources;
}

export function formatImports(imports: Array<string>, from: string, types: boolean): string {
    return imports.map(imp => {
        const [type, name] = imp.split(":");
        if (type === "model") {
            const r = relative(from, resolve(fileURLToPath(new URL("../lib/models", import.meta.url))));
            return `import${types ? " type" : ""} ${name} from "${r}/${name}.js";`;
        } else if (type === "collection") {
            const r = relative(from, resolve(fileURLToPath(new URL("../lib/collections", import.meta.url))));
            return `import${types ? " type" : ""} ${name} from "${r}/${name}.js";`;
        }
        return "";
    }).join("\n");
}
