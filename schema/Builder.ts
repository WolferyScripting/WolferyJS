/* eslint-disable unicorn/consistent-function-scoping */
import {
    formatImports,
    getCollections,
    getModels,
    pathTo,
    type Resource
} from "./common.js";
import { type ChildModelCondition, type ChildModel, type ParentModel } from "./schema.js";
import { DefToType } from "../lib/util/Util.js";
import { parseTSConfigJSON  } from "types-tsconfig";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import type { PathLike } from "node:fs";

const exists = (path: PathLike): Promise<boolean> => access(path).then(() => true, () => false);
// const ucwords = (str: string): string => str.replaceAll(/\b\w/g, c => c.toUpperCase());
const tsconfig = parseTSConfigJSON(JSON.parse(await readFile(new URL("../tsconfig.json", import.meta.url), "utf8")))!;
const tsconfigBase = resolve(fileURLToPath(new URL("..", import.meta.url)), tsconfig.compilerOptions!.baseUrl!);
const writeFileWithAliases = async(path: string, data: string): Promise<void> => {
    for (const [name, [p]] of Object.entries(tsconfig.compilerOptions!.paths!)) {
        if (data.includes(name.slice(0, -1))) {
            data = data.replaceAll(name.slice(0, -1), relative(dirname(path), resolve(tsconfigBase, p!.slice(0, -1))) + "/");
        }
    }
    await writeFile(path, data);
};

const defaultSpacing = 4;
const baseDir = fileURLToPath(new URL("../lib/generated", import.meta.url));
type BuilderType = "collections" | "models";
class Builder<T extends BuilderType = BuilderType> {
    static generatedResourceIDsFile = join(baseDir, "ResourceIDs.ts");
    data?: Awaited<T extends "collections" ? ReturnType<typeof getCollections> : ReturnType<typeof getModels>>;
    generatedDefinitionsFile: string;
    generatedDir: string;
    generatedExportsFile: string;
    generatedRegistryFile: string;
    generatedTypesFile: string;
    type: T;
    constructor(type: T) {
        this.type = type;
        this.generatedDir = join(baseDir, this.type);
        this.generatedDefinitionsFile = join(this.generatedDir, "definitions.ts");
        this.generatedExportsFile = join(this.generatedDir, "exports.ts");
        this.generatedRegistryFile = join(this.generatedDir, "registry.ts");
        this.generatedTypesFile = join(this.generatedDir, "types.d.ts");
    }

    static async build(buildType: Omit<TemplateTypes, "resourceids"> | "comments", type: BuilderType): Promise<void>;
    static async build(buildType: "resourceids"): Promise<void>;
    static async build(buildType: TemplateTypes | "comments", type?: BuilderType): Promise<void> {
        switch (buildType) {
            case "comments": return (await new Builder(type!).load()).insertClassComments();
            case "definitions": return (await new Builder(type!).load()).buildDefinitions();
            case "exports": return (await new Builder(type!).load()).buildExports();
            case "registry": return (await new Builder(type!).load()).buildRegistry();
            case "types": return (await new Builder(type!).load()).buildTypes();
            case "resourceids": return Builder.buildResourceIDs();
        }
    }

    static async buildResourceIDs(): Promise<void> {
        await mkdir(baseDir, { recursive: true });

        const t = new Template("resourceids");
        await t.load();
        const excludeArgs = t.getOptions("args").exclude?.split(",") ?? [];
        const args = new Set<string>();
        const ids: Array<string> = [];
        const { resources: modelResources } = await getModels();
        const { resources: collectionResources } = await getCollections();
        for (const resource of [...modelResources, ...collectionResources]) {
            if (resource.args.length === 0) {
                ids.push(`export const ${resource.name} = "${resource.raw}";`);
            } else {
                for (const arg of resource.args) args.add(arg);
                ids.push(`/** ${resource.raw} */`, `export const ${resource.name} = f\`${resource.raw.replaceAll("{", "${")}\`;`);
            }
        }

        for (const exclude of excludeArgs) args.delete(exclude);

        const content = t.format({
            args: Array.from(args).map(a => `const ${a} = arg("${a}");`).join("\n"),
            ids:  ids.join("\n")
        });
        await writeFileWithAliases(this.generatedResourceIDsFile, content);
    }

    async buildDefinitions(): Promise<void> {
        if (!this.data) throw new Error("Builder not loaded");
        const t = new Template("definitions");
        await t.load();

        const imports = new Set<string>(), definitions: Array<string> = [];

        for (const resource of this.data.schema) {
            if ("child" in resource && resource.child) continue;
            if ("collection" in resource && resource.collection || (!("props" in resource) || Object.keys(resource.props).length === 0)) {
                definitions.push(`export const ${resource.name}Definition: Record<string, PropertyDefinition> = {};`, "");
            } else {
                definitions.push(`export const ${resource.name}Definition: Record<string, PropertyDefinition> = {`);
                if ("props" in resource && resource.props) {
                    for (const [propName, prop] of Object.entries(resource.props)) {
                        if ("literal" in prop && prop.literal && prop.type) {
                            definitions.push(`${propName}: { type: "${prop.type}" },`);
                        } else if ("oneOf" in prop && prop.oneOf && prop.type) {
                            definitions.push(`${propName}: { type: "${prop.type}" },`);
                        } else if ("ref" in prop && prop.ref) {
                            const optional = prop.ref.startsWith("?");
                            const name = optional ? prop.ref.slice(1) : prop.ref;
                            definitions.push(`${propName}: refProperty("${propName}", ${optional}, ${!!prop.error}), // ${name}`);
                            imports.add(`model:${name}`);
                        } else if ("model" in prop && prop.model) {
                            const optional = prop.model.startsWith("?");
                            const name = optional ? prop.model.slice(1) : prop.model;
                            definitions.push(`${propName}: modelProperty("${propName}", ${name}, ${optional}, ${!!prop.error}),`);
                            imports.add(`model:${name}`);
                        } else if ("collection" in prop && prop.collection) {
                            const optional = prop.collection.startsWith("?");
                            const name = optional ? prop.collection.slice(1) : prop.collection;
                            definitions.push(`${propName}: collectionProperty("${propName}", ${name}, ${optional}, ${!!prop.error}),`);
                            imports.add(`collection:${name}`);
                        } else if ("type" in prop && prop.type) {
                            definitions.push(`${propName}: { type: "${prop.type}" },`);
                        } else {
                            throw new Error(`not sure how to handle definition for ${propName} for ${resource.name} in ${this.type}`);
                        }
                    }
                }
                if (definitions.at(-1)?.at(-1) === ",") definitions.splice(-1, 1, definitions.at(-1)!.slice(0, -1));
                definitions.push("};", "");
            }
        }

        if (definitions.at(-1) === "") definitions.pop();

        const content = t.format({
            imports:     formatImports(Array.from(imports), this.generatedDir, false),
            definitions: definitions.join("\n")
        });
        await writeFileWithAliases(this.generatedDefinitionsFile, content);
    }

    async buildExports(): Promise<void> {
        if (!this.data) throw new Error("Builder not loaded");
        const t = new Template("exports");
        await t.load();
        const exports: Array<string> = [
            "export * from \"./definitions.js\";",
            "export type * from \"./types.js\";"
        ];

        for (const resource of this.data.schema) {
            if ("parent" in resource && resource.parent === true) continue;
            const f = resolve(fileURLToPath(new URL(`../lib/${this.type}/${resource.name}.js`, import.meta.url)));
            exports.push(`export { default as ${resource.name} } from "${relative(this.generatedDir, f)}";`);
        }

        const content = t.format({
            exports: exports.join("\n")
        });
        await writeFileWithAliases(this.generatedExportsFile, content);
    }

    async buildRegistry(): Promise<void> {
        if (!this.data) throw new Error("Builder not loaded");
        const t = new Template("registry");
        await t.load();

        const imports = new Set<string>(), registrations: Array<string> = [];

        if (this.type === "collections") {
            const r = this.data.resources as Array<Resource<"collection">>;
            for (const resource of r) {
                imports.add(`collection:${resource.collection}`);
                const args = resource.args.length === 0 ? "" : `({ ${resource.args.map(a => `${a}: "*"`).join(", ")} })`;
                registrations.push(`res.registerCollectionType(ResourceIDs.${resource.name}${args}, (api, rid) => new ${resource.collection}(client, api, rid));`);
            }
        } else if (this.type === "models") {
            const r = this.data.resources as Array<Resource<"model">>;
            for (const resource of r) {
                const model = this.data.schema.find(m => m.name === resource.model);
                const args = resource.args.length === 0 ? "" : `({ ${resource.args.map(a => `${a}: "*"`).join(", ")} })`;
                let reg = `res.registerModelType(ResourceIDs.${resource.name}${args}`;
                if (model && "parent" in model && model.parent) {
                    reg += `, (api, rid, data) => {\nconst d = data as ${(model as ParentModel).regDataType};`;
                    const children = this.data.schema.filter(m => "child" in m && m.child && m.parent === model.name) as Array<ChildModel>;
                    const format = (prop: string, c: ChildModelCondition): string => c.type === "eq" ? `d.${prop} === ${typeof c.value === "string" ? `"${c.value}"` : c.value}` : "";
                    for (const child of children) {
                        imports.add(`model:${child.name}`);
                        reg += "\nif (";
                        for (const [prop, condition] of Object.entries(child.conditions)) {
                            reg += `${format(prop, condition)} &&`;
                        }
                        reg = reg.slice(0, -3);
                        reg += `) return new ${child.name}(client, api, rid);`;
                    }
                    reg += "\nreturn client.options.clientOptions.defaultModelFactory!(api, rid, data);\n});";
                } else {
                    reg += `, (api, rid) => new ${resource.model}(client, api, rid));`;
                    imports.add(`model:${resource.model}`);
                }
                registrations.push(reg);
            }
        }

        const content = t.format({
            imports:       formatImports(Array.from(imports), this.generatedDir, false),
            registrations: registrations.join("\n"),
            type:          `${this.type.at(0)?.toUpperCase()}${this.type.slice(1)}`
        });
        await writeFileWithAliases(this.generatedRegistryFile, content);
    }

    async buildTypes(): Promise<void> {
        if (!this.data) throw new Error("Builder not loaded");
        const t = new Template("types");
        await t.load();

        const imports = new Set<string>(), types: Array<string> = [];

        for (const resource of this.data.schema) {
            if ("child" in resource && resource.child) continue;
            if ("collection" in resource && resource.collection || (!("props" in resource) || Object.keys(resource.props).length === 0)) {
                types.push("/**", ` * ${resource.description}`, " */", `export interface ${resource.name}Properties {}`, "");
            } else {
                types.push("/**", ` * ${resource.description}`, " */", `export interface ${resource.name}Properties {`);
                if ("props" in resource && resource.props) {
                    const properties: Array<string> = [], comments: Record<string, string> = {};
                    let formatted: string;
                    for (const [propName, prop] of Object.entries(resource.props)) {
                        if ("literal" in prop && prop.literal && prop.type) {
                            const optional = prop.type.startsWith("?");
                            formatted = `${propName}: ${prop.literal}${optional ? " | null" : ""};`;
                        } else if ("oneOf" in prop && prop.oneOf && prop.type) {
                            const optional = prop.type.startsWith("?");
                            if (prop.ts || prop.const) {
                                formatted = `${propName}: ${prop.ts || prop.const}${optional ? " | null" : ""};`;
                                if (prop.ts) imports.add(`type:${prop.ts}`);
                                if (prop.const) imports.add(`const:${prop.const}`);
                            } else {
                                formatted = `${propName}: ${prop.oneOf.map((v: unknown) => typeof v === "string" ? `"${v}"` : v).join(" | ")}${optional ? " | null" : ""};`;
                            }
                        } else if ("ref" in prop && prop.ref) {
                            const optional = prop.ref.startsWith("?");
                            const name = optional ? prop.ref.slice(1) : prop.ref;
                            formatted = `${propName}: ResRef<${name}>${prop.error ? " | ResError" : ""}${optional ? " | null" : ""};`;
                            imports.add(`model:${name}`);
                        } else if ("model" in prop && prop.model) {
                            const optional = prop.model.startsWith("?");
                            const name = optional ? prop.model.slice(1) : prop.model;
                            formatted = `${propName}: ${name}${prop.error ? " | ResError" : ""}${optional ? " | null" : ""};`;
                            imports.add(`model:${name}`);
                        } else if ("collection" in prop && prop.collection) {
                            const optional = prop.collection.startsWith("?");
                            const name = optional ? prop.collection.slice(1) : prop.collection;
                            formatted = `${propName}: ${name}${prop.error ? " | ResError" : ""}${optional ? " | null" : ""};`;
                            imports.add(`collection:${name}`);
                        } else if ("type" in prop && prop.type) {
                            if (prop.ts || prop.const) {
                                formatted = `${propName}: ${prop.ts || prop.const};`;
                                if (prop.ts) imports.add(`type:${prop.ts}`);
                                if (prop.const) imports.add(`const:${prop.const}`);
                            } else {
                                formatted = `${propName}: ${DefToType[prop.type]};`;
                            }
                        } else {
                            throw new Error(`not sure how to handle types for ${propName} for ${resource.name} in ${this.type}`);
                        }
                        properties.push(formatted!);
                        comments[formatted!] = prop.description;
                    }

                    for (const prop of properties.sort((a, b) => a.localeCompare(b))) types.push(`/** ${comments[prop]} */`, prop);
                }

                types.push("}", "");

                if ("parent" in resource && resource.parent === true) {
                    const children = this.data.schema.filter(m => "child" in m && m.child && m.parent === resource.name) as Array<ChildModel>;

                    types.push(`/** One of: ${children.map(c => `{@link ${c.name}}`).join(", ")} */`, `export type ${resource.name} = ${children.map(c => c.name).join(" | ")};`, "");
                    for (const child of children) imports.add(`model:${child.name}`);
                }
            }
        }

        if (types.at(-1) === "") types.pop();

        const content = t.format({
            imports: formatImports(Array.from(imports), this.generatedDir, true),
            types:   types.join("\n")
        });
        await writeFileWithAliases(this.generatedTypesFile, content);
    }

    async insertClassComments(): Promise<void> {
        if (!this.data) throw new Error("Builder not loaded");
        for (let resource of this.data.schema) {
            if ("parent" in resource) {
                if (resource.parent === true) continue;
                const parent = this.data.schema.find(r => "parent" in r && r.parent === true && r.name === (resource as ChildModel).parent) as ParentModel | undefined;
                if (!parent) throw new Error(`Parent model ${resource.parent} for ${resource.name} not found`);
                const child = resource;
                resource = structuredClone(parent);
                resource.name = child.name;
                if (child.description) resource.description = child.description;
            }
            const path = resolve(dirname(fileURLToPath(import.meta.url)), pathTo(resource.name, this.type.slice(0, -1) as "model" | "collection", "ts"));
            if (!await exists(path)) {
                console.log(`insertClassComments: File for ${this.type.slice(0, -1)} ${resource.name} seems to not exist, skipping..`);
                continue;
            }
            const contents = (await readFile(path, "utf8")).split("\n");
            const originalContents = Array.from(contents);
            const classStart = contents.findIndex(line => line.includes(`class ${resource.name}`));
            const commentStart = contents.findIndex((line, index) => index < classStart && line.match(/^\s*\/\*\*/));
            const docLine = (str: string): string => ` * ${(str.trim().startsWith("*") ? str.trim().slice(1) : str).trim()}`;
            const formatRIDs = (): Array<string> => resource.id.map(id => docLine(`@resourceID {@link ResourceIDs.${id.slice(0, id.indexOf("("))} | ${id.slice(0, id.indexOf("("))}}`));
            if (commentStart === -1) {
                // no comment, create a multi-line comment
                contents.splice(classStart, 0, "/**", ` * ${resource.description}`, " */");
            } else {
                const commentEnd = contents.findIndex((line, index) => index >= commentStart && line.endsWith("*/"));
                if (commentEnd === commentStart) {
                    // a comment exists, but only spans a single line. Assume it's a third party comment and keep it below our comment
                    const currentComment = contents[commentStart]!;
                    contents.splice(commentStart, 1, "/**", docLine(resource.description), ...formatRIDs(), docLine(currentComment.slice(currentComment.indexOf("*") + 3, currentComment.lastIndexOf("*") - 1)), " */");
                } else {
                    // a comment exists, and spans multiple lines. Assume the first line is our comment and replace it
                    const currentCommentLines = contents.slice(commentStart, commentEnd + 1);
                    let emptyTop = 0, emptyBottom = 0;
                    for (let i = 2; i < currentCommentLines.length - 1; i++) {
                        if (currentCommentLines[i]!.trim() === "*") emptyTop++;
                        else break;
                    }
                    for (let i = currentCommentLines.length - 2; i > 1; i--) {
                        if (currentCommentLines[i]!.trim() === "*") emptyBottom++;
                        else break;
                    }
                    if (emptyTop === 1 && emptyBottom === 1 && currentCommentLines.length === 4) emptyTop = 0;
                    let ridCount = 0;
                    for (let i = emptyTop + 2; i < currentCommentLines.length; i++) {
                        const line = currentCommentLines[i]!;
                        if (line.trim().startsWith("* @resourceID")) ridCount++;
                        else break;
                    }
                    const removeCount = 2 + emptyTop + ridCount;

                    const newCommentLines = [
                        "/**",
                        docLine(resource.description),
                        ...formatRIDs(),
                        ...currentCommentLines.slice(removeCount, -(emptyBottom + 1)).map(docLine),
                        " */"
                    ];
                    contents.splice(commentStart, commentEnd - commentStart + 1, ...newCommentLines);
                }
            }

            const nowClassStart = contents.findIndex(line => line.includes(`class ${resource.name}`));
            const nowComment = contents.findIndex((line, index) => index < nowClassStart && line.match(/^\s*\/\*\*/));
            if (nowComment === -1) throw new Error(`Failed to insert comment into ${resource.name} ${this.type.slice(0, -1)}`);

            const notice = "// do not edit the first line of the class comment";
            if (contents.at(nowComment - 1) !== notice) {
                contents.splice(nowComment, 0, notice);
            }

            if (!isDeepStrictEqual(contents, originalContents)) {
                await writeFile(path, contents.join("\n"), "utf8");
            }
        }
    }

    async load(): Promise<this> {
        await mkdir(this.generatedDir, { recursive: true });
        if (this.type === "collections") {
            this.data = await getCollections() as never;
        } else if (this.type === "models") {
            this.data = await getModels() as never;
        }

        return this;
    }
}

const templates = {
    definitions: fileURLToPath(new URL("templates/definitions.ts", import.meta.url)),
    exports:     fileURLToPath(new URL("templates/exports.ts", import.meta.url)),
    registry:    fileURLToPath(new URL("templates/registry.ts", import.meta.url)),
    resourceids: fileURLToPath(new URL("templates/ResourceIDs.ts", import.meta.url)),
    types:       fileURLToPath(new URL("templates/types.d.ts", import.meta.url))
};
type TemplateTypes = keyof typeof templates;
class Template {
    content?: string;
    type: TemplateTypes;
    constructor(type: TemplateTypes) {
        this.type = type;
    }

    format(inputs: Record<string, string>): string {
        if (!this.content) throw new Error("Template not loaded");
        let output = this.content;
        for (const [key, value] of Object.entries(inputs)) {
            const regex = new RegExp(`/\\* =${key}(\\(.*\\))? \\*/`, "g");
            const ln = this.content.split("\n").find(line => regex.test(line));
            const includedSpacing = ln?.match(/^(\s*)/)?.[1]?.length ?? 0;
            let v =  value, brace = false;
            if (includedSpacing > 0) {
                v = value.split("\n").map((line, index) => {
                    if (index === 0) return line;
                    if (line.startsWith("}")) brace = false;
                    const newLine = " ".repeat(brace ? includedSpacing * 2 : includedSpacing) + line;
                    if (line.endsWith("{")) brace = true;
                    return newLine;
                }).join("\n");
            } else {
                v = value.split("\n").map(line => {
                    if (line.startsWith("}")) brace = false;
                    const newLine = " ".repeat(brace ? defaultSpacing : 0) + line;
                    if (line.endsWith("{")) brace = true;
                    return newLine;
                }).join("\n");
            }
            output = output.replace(regex, v);
        }
        return output;
    }

    getOptions(name: string): Record<string, string> {
        if (!this.content) throw new Error("Template not loaded");
        const match = this.content.match(new RegExp(`/\\* =${name}\\((.*)\\) \\*/`));
        if (!match?.[1]) return {};
        const options: Record<string, string> = {};
        for (const option of match[1].split(/, ?/)) {
            const [key, value] = option.split("=");
            if (key && value) {
                options[key.trim()] = value.trim();
            }
        }
        return options;
    }

    async load(): Promise<void> {
        const filePath = templates[this.type];
        this.content = await readFile(filePath, { encoding: "utf8" });
    }
}

async function buildAll(type?: BuilderType): Promise<void> {
    await insertClassComments(type);
    await buildDefinitions(type);
    await buildExports(type);
    await buildRegistry(type);
    await buildTypes(type);
    await buildResourceIDs();
}
async function insertClassComments(type?: BuilderType): Promise<void> {
    console.log(`Inserting class comments:${type ?? "all"}`);
    if (!type || type === "collections") await Builder.build("comments", "collections");
    if (!type || type === "models") await Builder.build("comments", "models");
}
async function buildDefinitions(type?: BuilderType): Promise<void> {
    console.log(`Building definitions:${type ?? "all"}`);
    if (!type || type === "collections") await Builder.build("definitions", "collections");
    if (!type || type === "models") await Builder.build("definitions", "models");
}
async function buildExports(type?: BuilderType): Promise<void> {
    console.log(`Building exports:${type ?? "all"}`);
    if (!type || type === "collections") await Builder.build("exports", "collections");
    if (!type || type === "models") await Builder.build("exports", "models");
}
async function buildRegistry(type?: BuilderType): Promise<void> {
    console.log(`Building registry:${type ?? "all"}`);
    if (!type || type === "collections") await Builder.build("registry", "collections");
    if (!type || type === "models")  await Builder.build("registry", "models");
}
async function buildTypes(type?: BuilderType): Promise<void> {
    console.log(`Building types:${type ?? "all"}`);
    if (!type || type === "collections") await Builder.build("types", "collections");
    if (!type || type === "models") await Builder.build("types", "models");
}
async function buildResourceIDs(): Promise<void> {
    console.log("Building resourceids");
    await Builder.build("resourceids");
}
async function cli(buildType?: TemplateTypes | "comments", type?: BuilderType): Promise<void> {
    switch (buildType) {
        case "comments": return insertClassComments(type);
        case "definitions": return buildDefinitions(type);
        case "exports": return buildExports(type);
        case "registry": return buildRegistry(type);
        case "types": return buildTypes(type);
        case "resourceids": return buildResourceIDs();
        default: return buildAll(type);
    }
}

const path = resolve(fileURLToPath(import.meta.url));
const nodePath = resolve(process.argv[1]!);
const isCli = path.includes(nodePath);

if (isCli) {
    const args = process.argv.slice(2);
    const buildType = args[0] as TemplateTypes | undefined;
    const type = args[1] as BuilderType | undefined;
    await cli(buildType, type);
}
