import { type Static, Type } from "@sinclair/typebox";

export const Types = Type.Union([
    Type.Literal("any"),
    Type.Literal("string"),
    Type.Literal("?string"),
    Type.Literal("number"),
    Type.Literal("?number"),
    Type.Literal("boolean"),
    Type.Literal("?boolean"),
    Type.Literal("object"),
    Type.Literal("?object"),
    Type.Literal("array"),
    Type.Literal("?array"),
    Type.Literal("array[string]"),
    Type.Literal("?array[string]"),
    Type.Literal("array[number]"),
    Type.Literal("?array[number]"),
    Type.Literal("function"),
    Type.Literal("?function")
]);
export const PropertySchema = Type.Object({
    description: Type.String(),
    model:       Type.Optional(Type.String()),
    collection:  Type.Optional(Type.String()),
    literal:     Type.Optional(Type.String()),
    oneOf:       Type.Optional(Type.Array(Type.Any())),
    type:        Type.Optional(Types)
});

export const ModelSchema = Type.Object({
    collection:  Type.Optional(Type.Literal(false)),
    description: Type.String(),
    id:          Type.Array(Type.String()),
    name:        Type.String(),
    props:       Type.Record(Type.String(), PropertySchema)
});
export const ModelCollectionSchema = Type.Object({
    collection:  Type.Literal(true),
    description: Type.String(),
    id:          Type.Array(Type.String()),
    model:       Type.String(),
    name:        Type.String()
});

export const ModelsSchema = Type.Array(Type.Union([ModelSchema, ModelCollectionSchema]));

export type Model = Static<typeof ModelSchema>;
export type Models = Static<typeof ModelsSchema>;

export const CollectionSchema = Type.Object({
    description: Type.String(),
    id:          Type.Array(Type.String()),
    model:       Type.Union([Type.String(), Type.Null()]),
    name:        Type.String(),
    object:      Type.Optional(Type.Record(Type.String(), PropertySchema))
});
export const CollectionsSchema = Type.Array(CollectionSchema);

export type Collection = Static<typeof CollectionSchema>;
export type Collections = Static<typeof CollectionsSchema>;
