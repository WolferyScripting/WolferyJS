import { CollectionsSchema, ModelsSchema } from "./schema.js";
import { writeFile } from "node:fs/promises";

await writeFile(new URL("models.schema.json", import.meta.url), JSON.stringify(ModelsSchema, null, 2));
await writeFile(new URL("collections.schema.json", import.meta.url), JSON.stringify(CollectionsSchema, null, 2));
