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
const OneOfPropertySchema = Type.Object({
    description: Type.String(),
    type:        Types,
    oneOf:       Type.Array(Type.Any())
});
const RefPropertySchema = Type.Object({
    description: Type.String(),
    ref:         Type.String(),
    error:       Type.Optional(Type.Boolean())
});
const ModelPropertySchema = Type.Object({
    description: Type.String(),
    model:       Type.String(),
    error:       Type.Optional(Type.Boolean())
});
const CollectionPropertySchema = Type.Object({
    description: Type.String(),
    collection:  Type.String(),
    error:       Type.Optional(Type.Boolean())
});
const BasicPropertySchema = Type.Object({
    description: Type.String(),
    literal:     Type.Optional(Type.String()),
    type:        Types
});
export const PropertySchema = Type.Union([
    OneOfPropertySchema,
    RefPropertySchema,
    ModelPropertySchema,
    CollectionPropertySchema,
    BasicPropertySchema
]);

export const ModelSchema = Type.Object({
    collection:  Type.Optional(Type.Literal(false)),
    description: Type.String(),
    id:          Type.Array(Type.String()),
    name:        Type.String(),
    props:       Type.Record(Type.String(), PropertySchema)
});
const BaseModelCollectionSchema = Type.Object({
    collection:  Type.Literal(true),
    description: Type.String(),
    id:          Type.Array(Type.String()),
    model:       Type.Optional(Type.String()),
    ref:         Type.Optional(Type.String()),
    name:        Type.String()
});
export const ModelCollectionSchema = Type.Union([
    Type.Composite([BaseModelCollectionSchema, Type.Object({ model: Type.String() })]),
    Type.Composite([BaseModelCollectionSchema, Type.Object({ ref: Type.String() })])
]);

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
