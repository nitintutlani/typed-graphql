// graphql.js

export function graphql(
    schema: GraphQLSchema,
    requestString: string,
    rootValue?: any,
    contextValue?: any,
    variableValues?: { [key: string]: any },
    operationName?: string
): Promise<GraphQLResult>;

interface GraphQLResult {
    data?: any;
    errors?: Array<GraphQLError>;
}

// error/*.js

declare class GraphQLError extends Error {
    constructor(
        message: string,
        nodes?: Array<any>,
        stack?: string,
        source?: Source,
        positions?: Array<number>
    );
}

export function formatError(error: GraphQLError): GraphQLFormattedError;

interface GraphQLFormattedError {
    message: string,
    locations: Array<GraphQLErrorLocation>
}

interface GraphQLErrorLocation {
    line: number,
    column: number
}

declare function locatedError(originalError: Error, nodes: Array<any>): GraphQLError;

declare function syntaxError(source: Source, position: number, description: string): GraphQLError;

// execution/*.js

interface ExecutionContext {
    schema: GraphQLSchema;
    fragments: {[key: string]: FragmentDefinition};
    rootValue: any;
    operation: OperationDefinition;
    variableValues: {[key: string]: any};
    errors: Array<GraphQLError>;
}

interface ExecutionResult {
    data: any;
    errors?: Array<GraphQLError>;
}

declare function execute(
    schema: GraphQLSchema,
    documentAST: Document,
    rootValue?: any,
    contextValue?: any,
    variableValues?: {[key: string]: any},
    operationName?: string
): Promise<ExecutionResult>;

declare function getVariableValues(
    schema: GraphQLSchema,
    definitionASTs: Array<VariableDefinition>,
    inputs: { [key: string]: any }
): { [key: string]: any };

declare function getArgumentValues(
    argDefs: Array<GraphQLArgument>,
    argASTs: Array<Argument>,
    variableValues: { [key: string]: any }
): { [key: string]: any };

// validation/*.js

type ValidationRule = (context: ValidationContext) => any;

export function validate(
    schema: GraphQLSchema,
    ast: Document,
    rules?: Array<any>
): Array<GraphQLError>;

export const specifiedRules: Array<ValidationRule>;

type HasSelectionSet = OperationDefinition | FragmentDefinition;
type VariableUsage = { node: Variable, type: GraphQLInputType };

declare class ValidationContext {
  constructor(schema: GraphQLSchema, ast: Document, typeInfo: TypeInfo);
  reportError(error: GraphQLError): void;
  getErrors(): Array<GraphQLError>;
  getSchema(): GraphQLSchema;
  getDocument(): Document;
  getFragment(name: string): FragmentDefinition;
  getFragmentSpreads(node: SelectionSet): Array<FragmentSpread>;
  getRecursivelyReferencedFragments(
    operation: OperationDefinition
  ): Array<FragmentDefinition>;
  getVariableUsages(node: HasSelectionSet): Array<VariableUsage>;
  getRecursiveVariableUsages(
    operation: OperationDefinition
  ): Array<VariableUsage>;
  getType(): GraphQLOutputType;
  getParentType(): GraphQLCompositeType;
  getInputType(): GraphQLInputType;
  getFieldDef(): GraphQLFieldDefinition;
  getDirective(): GraphQLDirective;
  getArgument(): GraphQLArgument;
}

// jsutils/*.js

declare function find<T>(list: Array<T>, predicate: (item: T) => boolean): T;
declare function invariant(condition: any, message: string): void;
declare function isNullish(value: any): boolean;
declare function keyMap<T>(
    list: Array<T>,
    keyFn: (item: T) => string
): {[key: string]: T};
declare function keyValMap<T, V>(
    list: Array<T>,
    keyFn: (item: T) => string,
    valFn: (item: T) => V
): {[key: string]: V}

// language/ast.js
interface Location {
    start: number;
    end: number;
    source?: Source
}

type Node = Name
             | Document
             | OperationDefinition
             | VariableDefinition
             | Variable
             | SelectionSet
             | Field
             | Argument
             | FragmentSpread
             | InlineFragment
             | FragmentDefinition
             | IntValue
             | FloatValue
             | StringValue
             | BooleanValue
             | EnumValue
             | ListValue
             | ObjectValue
             | ObjectField
             | Directive
             | ListType
             | NonNullType
             | ObjectTypeDefinition
             | FieldDefinition
             | InputValueDefinition
             | InterfaceTypeDefinition
             | UnionTypeDefinition
             | ScalarTypeDefinition
             | EnumTypeDefinition
             | EnumValueDefinition
             | InputObjectTypeDefinition
             | TypeExtensionDefinition;

interface Name {
    kind: string;
    loc?: Location;
    value: string;
}

interface Document {
    kind: string;
    loc?: Location;
    definitions: Array<Definition>;
}

type Definition = OperationDefinition
            | FragmentDefinition
            | TypeDefinition;

interface OperationDefinition {
    kind: string;
    loc?: Location;
    // Note: subscription is an experimental non-spec addition.
    operation: string;
    name?: Name;
    variableDefinitions?: Array<VariableDefinition>;
    directives?: Array<Directive>;
    selectionSet: SelectionSet;
}

interface VariableDefinition {
    kind: string;
    loc?: Location;
    variable: Variable;
    type: Type;
    defaultValue?: Value;
}

interface Variable {
    kind: string;
    loc?: Location;
    name: Name;
}

interface SelectionSet {
    kind: string;
    loc?: Location;
    selections: Array<Selection>;
}

type Selection = Field
            | FragmentSpread
            | InlineFragment;

interface Field {
    kind: string;
    loc?: Location;
    alias?: Name;
    name: Name;
    arguments?: Array<Argument>;
    directives?: Array<Directive>;
    selectionSet?: SelectionSet;
}

interface Argument {
    kind: string;
    loc?: Location;
    name: Name;
    value: Value;
}


// Fragments

interface FragmentSpread {
    kind: string;
    loc?: Location;
    name: Name;
    directives?: Array<Directive>;
}

interface InlineFragment {
    kind: string;
    loc?: Location;
    typeCondition?: NamedType;
    directives?: Array<Directive>;
    selectionSet: SelectionSet;
}

interface FragmentDefinition {
    kind: string;
    loc?: Location;
    name: Name;
    typeCondition: NamedType;
    directives?: Array<Directive>;
    selectionSet: SelectionSet;
}


// Values

type Value = Variable
            | IntValue
            | FloatValue
            | StringValue
            | BooleanValue
            | EnumValue
            | ListValue
            | ObjectValue;

interface IntValue {
    kind: string;
    loc?: Location;
    value: string;
}

interface FloatValue {
    kind: string;
    loc?: Location;
    value: string;
}

interface StringValue {
    kind: string;
    loc?: Location;
    value: string;
}

interface BooleanValue {
kind: string;
loc?: Location;
value: boolean;
}

interface EnumValue {
    kind: string;
    loc?: Location;
    value: string;
}

interface ListValue {
    kind: string;
    loc?: Location;
    values: Array<Value>;
}

interface ObjectValue {
    kind: string;
    loc?: Location;
    fields: Array<ObjectField>;
}

interface ObjectField {
    kind: string;
    loc?: Location;
    name: Name;
    value: Value;
}


// Directives

interface Directive {
    kind: string;
    loc?: Location;
    name: Name;
    arguments?: Array<Argument>;
}


// Type Reference

type Type = NamedType
            | ListType
            | NonNullType;

interface NamedType {
    kind: string;
    loc?: Location;
    name: Name;
}

interface ListType {
    kind: string;
    loc?: Location;
    type: Type;
}

interface NonNullType {
    kind: string;
    loc?: Location;
    type: NamedType | ListType;
}

// Type Definition

type TypeDefinition = ObjectTypeDefinition
                    | InterfaceTypeDefinition
                    | UnionTypeDefinition
                    | ScalarTypeDefinition
                    | EnumTypeDefinition
                    | InputObjectTypeDefinition
                    | TypeExtensionDefinition;

interface ObjectTypeDefinition {
    kind: string;
    loc?: Location;
    name: Name;
    interfaces?: Array<NamedType>;
    fields: Array<FieldDefinition>;
}

interface FieldDefinition {
    kind: string;
    loc?: Location;
    name: Name;
    arguments: Array<InputValueDefinition>;
    type: Type;
}

interface InputValueDefinition {
    kind: string;
    loc?: Location;
    name: Name;
    type: Type;
    defaultValue?: Value;
}

interface InterfaceTypeDefinition {
    kind: string;
    loc?: Location;
    name: Name;
    fields: Array<FieldDefinition>;
}

interface UnionTypeDefinition {
    kind: string;
    loc?: Location;
    name: Name;
    types: Array<NamedType>;
}

interface ScalarTypeDefinition {
    kind: string;
    loc?: Location;
    name: Name;
}

interface EnumTypeDefinition {
    kind: string;
    loc?: Location;
    name: Name;
    values: Array<EnumValueDefinition>;
}

interface EnumValueDefinition {
    kind: string;
    loc?: Location;
    name: Name;
}

interface InputObjectTypeDefinition {
    kind: string;
    loc?: Location;
    name: Name;
    fields: Array<InputValueDefinition>;
}

interface TypeExtensionDefinition {
    kind: string;
    loc?: Location;
    definition: ObjectTypeDefinition;
}

// language/kinds.js

declare const NAME: string;

// Document

declare const DOCUMENT: string;
declare const OPERATION_DEFINITION: string;
declare const VARIABLE_DEFINITION: string;
declare const VARIABLE: string;
declare const SELECTION_SET: string;
declare const FIELD: string;
declare const ARGUMENT: string;

// Fragments

declare const FRAGMENT_SPREAD: string;
declare const INLINE_FRAGMENT: string;
declare const FRAGMENT_DEFINITION: string;

// Values

declare const INT: string;
declare const FLOAT: string;
declare const STRING: string;
declare const BOOLEAN: string;
declare const ENUM: string;
declare const LIST: string;
declare const OBJECT: string;
declare const OBJECT_FIELD: string;

// Directives

declare const DIRECTIVE: string;

// Types

declare const NAMED_TYPE: string;
declare const LIST_TYPE: string;
declare const NON_NULL_TYPE: string;

// Type Definitions

declare const OBJECT_TYPE_DEFINITION: string;
declare const FIELD_DEFINITION: string;
declare const INPUT_VALUE_DEFINITION: string;
declare const INTERFACE_TYPE_DEFINITION: string;
declare const UNION_TYPE_DEFINITION: string;
declare const SCALAR_TYPE_DEFINITION: string;
declare const ENUM_TYPE_DEFINITION: string;
declare const ENUM_VALUE_DEFINITION: string;
declare const INPUT_OBJECT_TYPE_DEFINITION: string;
declare const TYPE_EXTENSION_DEFINITION: string;

// language/lexer.js

interface Token {
    kind: number;
    start: number;
    end: number;
    value: string;
}

type Lexer = (resetPosition?: number) => Token;

declare function lex(source: Source): Lexer;

type TokenKind = {[key: string]: number};

declare function getTokenDesc(token: Token): string;
declare function getTokenKindDesc(kind: number): string;

// language/location.js

interface SourceLocation {
    line: number;
    column: number;
}

declare function getLocation(source: Source, position: number): SourceLocation;

// language/parser.js

interface ParseOptions {
    noLocation?: boolean,
    noSource?: boolean,
}

declare function parse(
    source: Source | string,
    options?: ParseOptions
): Document;

declare function parseValue(
    source: Source | string,
    options?: ParseOptions
): Value;

declare function parseConstValue(parser: any): Value;

declare function parseType(parser: any): Type;

declare function parseNamedType(parser: any): NamedType;

// language/printer.js

declare function print(ast: any): string;

// language/source.js

declare class Source {
    body: string;
    name: string;
    constructor(body: string, name?: string);
}

// language/visitor.js

interface QueryDocumentKeys {
    Name: any[];
    Document: string[];
    OperationDefinition: string[];
    VariableDefinition: string[];
    Variable: string[];
    SelectionSet: string[];
    Field: string[];
    Argument: string[];

    FragmentSpread: string[];
    InlineFragment: string[];
    FragmentDefinition: string[];

    IntValue: number[];
    FloatValue: number[];
    StringValue: string[];
    BooleanValue: boolean[];
    EnumValue: any[];
    ListValue: string[];
    ObjectValue: string[];
    ObjectField: string[];

    Directive: string[];

    NamedType: string[];
    ListType: string[];
    NonNullType: string[];

    ObjectTypeDefinition: string[];
    FieldDefinition: string[];
    InputValueDefinition: string[];
    InterfaceTypeDefinition: string[];
    UnionTypeDefinition: string[];
    ScalarTypeDefinition: string[];
    EnumTypeDefinition: string[];
    EnumValueDefinition: string[];
    InputObjectTypeDefinition: string[];
    TypeExtensionDefinition: string[];
}

declare const BREAK: Object;

declare function visit(root: any, visitor: any, keyMap: any): any;

declare function visitInParallel(visitors: any): any;

declare function visitWithTypeInfo(typeInfo: any, visitor: any): any;

// type/definition.js

type GraphQLType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLUnionType |
    GraphQLEnumType |
    GraphQLInputObjectType |
    GraphQLList |
    GraphQLNonNull;

declare function isType(type: any): boolean;

type GraphQLInputType =
    GraphQLScalarType |
    GraphQLEnumType |
    GraphQLInputObjectType |
    GraphQLList |
    GraphQLNonNull;

declare function isInputType(type: GraphQLType): boolean;

type GraphQLOutputType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLUnionType |
    GraphQLEnumType |
    GraphQLList |
    GraphQLNonNull;

declare function isOutputType(type: GraphQLType): boolean;

type GraphQLLeafType =
    GraphQLScalarType |
    GraphQLEnumType;

declare function isLeafType(type: GraphQLType): boolean;

type GraphQLCompositeType =
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLUnionType;

declare function isCompositeType(type: GraphQLType): boolean;

type GraphQLAbstractType =
    GraphQLInterfaceType |
    GraphQLUnionType;

declare function isAbstractType(type: GraphQLType): boolean;

type GraphQLNullableType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLUnionType |
    GraphQLEnumType |
    GraphQLInputObjectType |
    GraphQLList;

declare function getNullableType(type: GraphQLType): GraphQLNullableType;

type GraphQLNamedType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLUnionType |
    GraphQLEnumType |
    GraphQLInputObjectType;

declare function getNamedType(type: GraphQLType): GraphQLNamedType;

export class GraphQLScalarType {
    constructor(config: GraphQLScalarTypeConfig);
    serialize(value: any): any;
    parseValue(value: any): any;
    parseLiteral(valueAST: Value): any;
    toString(): string;
}

interface GraphQLScalarTypeConfig {
    name: string;
    description?: string;
    serialize: (value: any) => any;
    parseValue?: (value: any) => any;
    parseLiteral?: (valueAST: Value) => any;
}

export class GraphQLObjectType {
    constructor(config: GraphQLObjectTypeConfig);
    getFields(): GraphQLFieldDefinitionMap;
    getInterfaces(): Array<GraphQLInterfaceType>;
    toString(): string;
}

interface GraphQLObjectTypeConfig {
    name: string;
    interfaces?: GraphQLInterfacesThunk | Array<GraphQLInterfaceType>;
    fields: GraphQLFieldConfigMapThunk | GraphQLFieldConfigMap;
    isTypeOf?: (value: any, info?: GraphQLResolveInfo) => boolean;
    description?: string
}

type GraphQLInterfacesThunk = () => Array<GraphQLInterfaceType>;

type GraphQLFieldConfigMapThunk = () => GraphQLFieldConfigMap;

type GraphQLFieldResolveFn = (
    source?: any,
    args?: { [argName: string]: any },
    context?: any,
    info?: GraphQLResolveInfo
) => any;

interface GraphQLResolveInfo {
    fieldName: string,
    fieldASTs: Array<Field>,
    returnType: GraphQLOutputType,
    parentType: GraphQLCompositeType,
    schema: GraphQLSchema,
    fragments: { [fragmentName: string]: FragmentDefinition },
    rootValue: any,
    operation: OperationDefinition,
    variableValues: { [variableName: string]: any },
}

interface GraphQLFieldConfig {
    type: GraphQLOutputType;
    args?: GraphQLFieldConfigArgumentMap;
    resolve?: GraphQLFieldResolveFn;
    deprecationReason?: string;
    description?: string;
}

interface GraphQLFieldConfigArgumentMap {
    [argName: string]: GraphQLArgumentConfig;
}

interface GraphQLArgumentConfig {
    type: GraphQLInputType;
    defaultValue?: any;
    description?: string;
}

interface GraphQLFieldConfigMap {
    [fieldName: string]: GraphQLFieldConfig;
}

interface GraphQLFieldDefinition {
    name: string;
    description: string;
    type: GraphQLOutputType;
    args: Array<GraphQLArgument>;
    resolve?: GraphQLFieldResolveFn;
    deprecationReason?: string;
}

interface GraphQLArgument {
    name: string;
    type: GraphQLInputType;
    defaultValue?: any;
    description?: string;
}

interface GraphQLFieldDefinitionMap {
    [fieldName: string]: GraphQLFieldDefinition;
}

export class GraphQLInterfaceType {
    name: string;
    description: string;
    resolveType: (value: any, info?: GraphQLResolveInfo) => GraphQLObjectType;
    constructor(config: GraphQLInterfaceTypeConfig);
    getFields(): GraphQLFieldDefinitionMap;
    getPossibleTypes(): Array<GraphQLObjectType>;
    isPossibleType(type: GraphQLObjectType): boolean;
    getObjectType(value: any, info: GraphQLResolveInfo): GraphQLObjectType;
    toString(): string;
}

interface GraphQLInterfaceTypeConfig {
    name: string;
    fields: GraphQLFieldConfigMapThunk | GraphQLFieldConfigMap;
    resolveType?: (value: any, info?: GraphQLResolveInfo) => GraphQLObjectType;
    description?: string;
}

export class GraphQLUnionType {
    name: string;
    description: string;
    resolveType: (value: any, info?: GraphQLResolveInfo) => GraphQLObjectType;
    constructor(config: GraphQLUnionTypeConfig);
    getPossibleTypes(): Array<GraphQLObjectType>;
    isPossibleType(type: GraphQLObjectType): boolean;
    getObjectType(value: any, info: GraphQLResolveInfo): GraphQLObjectType;
    toString(): string;
}


interface GraphQLUnionTypeConfig {
    name: string,
    types: Array<GraphQLObjectType>,
    /**
     * Optionally provide a custom type resolver function. If one is not provided,
     * the default implementation will call `isTypeOf` on each implementing
     * Object type.
     */
    resolveType?: (value: any, info?: GraphQLResolveInfo) => GraphQLObjectType;
    description?: string;
}

export class GraphQLEnumType {
    name: string;
    description: string;
    constructor(config: GraphQLEnumTypeConfig);
    getValues(): Array<GraphQLEnumValueDefinition>;
    serialize(value: any): string;
    parseValue(value: any): any;
    parseLiteral(valueAST: Value): any;
    toString(): string;
}

interface GraphQLEnumTypeConfig {
    name: string;
    values: GraphQLEnumValueConfigMap;
    description?: string;
}

interface GraphQLEnumValueConfigMap {
    [valueName: string]: GraphQLEnumValueConfig;
}

interface GraphQLEnumValueConfig {
    value?: any;
    deprecationReason?: string;
    description?: string;
}

interface GraphQLEnumValueDefinition {
    name: string;
    description: string;
    deprecationReason: string;
    value: any;
}

export class GraphQLInputObjectType {
    name: string;
    description: string;
    constructor(config: InputObjectConfig);
    getFields(): InputObjectFieldMap;
    toString(): string;
}

interface InputObjectConfig {
    name: string;
    fields: InputObjectConfigFieldMapThunk | InputObjectConfigFieldMap;
    description?: string;
}

type InputObjectConfigFieldMapThunk = () => InputObjectConfigFieldMap;

interface InputObjectFieldConfig {
    type: GraphQLInputType;
    defaultValue?: any;
    description?: string;
}

interface InputObjectConfigFieldMap {
    [fieldName: string]: InputObjectFieldConfig;
}

interface InputObjectField {
    name: string;
    type: GraphQLInputType;
    defaultValue?: any;
    description?: string;
}

interface InputObjectFieldMap {
    [fieldName: string]: InputObjectField;
}

export class GraphQLList {
    ofType: GraphQLType;
    constructor(type: GraphQLType);
    toString(): string;
}

export class GraphQLNonNull {
    ofType: GraphQLNullableType;
    constructor(type: GraphQLNullableType);
    toString(): string;
}

// type/directives.js

declare class GraphQLDirective {
    name: string;
    description: string;
    args: Array<GraphQLArgument>;
    onOperation: boolean;
    onFragment: boolean;
    onField: boolean;
    constructor(config: GraphQLDirectiveConfig);
}

interface GraphQLDirectiveConfig {
    name: string;
    description?: string;
    args?: Array<GraphQLArgument>;
    onOperation?: boolean;
    onFragment?: boolean;
    onField?: boolean;
}

export var GraphQLIncludeDirective: GraphQLDirective;

export var GraphQLSkipDirective: GraphQLDirective;

// type/introspection.js

declare var __Schema: GraphQLObjectType;

type TypeKind = {[key: string]: string};

declare var SchemaMetaFieldDef: GraphQLFieldDefinition;

declare var TypeMetaFieldDef: GraphQLFieldDefinition;

declare var TypeNameMetaFieldDef: GraphQLFieldDefinition;

// type/scalars.js

export var GraphQLInt: GraphQLScalarType;
export var GraphQLFloat: GraphQLScalarType;
export var GraphQLString: GraphQLScalarType;
export var GraphQLBoolean: GraphQLScalarType;
export var GraphQLID: GraphQLScalarType;

// type/schema.js

export class GraphQLSchema {
    constructor(config: GraphQLSchemaConfig);
    getQueryType(): GraphQLObjectType;
    getMutationType(): GraphQLObjectType;
    getSubscriptionType(): GraphQLObjectType;
    getTypeMap(): TypeMap;
    getType(name: string): GraphQLType;
    getDirectives(): Array<GraphQLDirective>;
    getDirective(name: string): GraphQLDirective;
}

type TypeMap = { [typeName: string]: GraphQLType };

interface GraphQLSchemaConfig {
    query: GraphQLObjectType;
    mutation?: GraphQLObjectType;
    subscription?: GraphQLObjectType;
    directives?: Array<GraphQLDirective>;
}

// utilities/Typeinfo.js

declare class TypeInfo {
  constructor(
    schema: GraphQLSchema,
    getFieldDefFn?: typeof getFieldDef
  );

  getType(): GraphQLOutputType;
  getParentType(): GraphQLCompositeType;
  getInputType(): GraphQLInputType;
  getFieldDef(): GraphQLFieldDefinition;
  getDirective(): GraphQLDirective;
  getArgument(): GraphQLArgument;
  enter(node: Node);
  leave(node: Node);
}

declare function getFieldDef(
  schema: GraphQLSchema,
  parentType: GraphQLType,
  fieldAST: Field
): GraphQLFieldDefinition;

// utilities/buildASTSchema.js
declare function buildASTSchema(ast: Document): GraphQLSchema

// type/directives.js
declare enum DirectiveLocationEnum {
  QUERY,
  MUTATION,
  SUBSCRIPTION,
  FIELD,
  FRAGMENT_DEFINITION,
  FRAGMENT_SPREAD,
  INLINE_FRAGMENT,
}

// utilities/introspectionQuery
export const introspectionQuery: string;

interface IntrospectionQuery {
  __schema: IntrospectionSchema;
}

interface IntrospectionSchema {
  queryType: IntrospectionNamedTypeRef;
  mutationType?: IntrospectionNamedTypeRef;
  subscriptionType?: IntrospectionNamedTypeRef;
  types: Array<IntrospectionType>;
  directives: Array<IntrospectionDirective>;
}

type IntrospectionType =
  IntrospectionScalarType |
  IntrospectionObjectType |
  IntrospectionInterfaceType |
  IntrospectionUnionType |
  IntrospectionEnumType |
  IntrospectionInputObjectType

interface IntrospectionScalarType {
  kind: 'SCALAR';
  name: string;
  description?: string;
}

interface IntrospectionObjectType {
  kind: 'OBJECT';
  name: string;
  description?: string;
  fields: Array<IntrospectionField>;
  interfaces: Array<IntrospectionNamedTypeRef>;
}

interface IntrospectionInterfaceType {
  kind: 'INTERFACE';
  name: string;
  description?: string;
  fields: Array<IntrospectionField>;
  possibleTypes: Array<IntrospectionNamedTypeRef>;
}

interface IntrospectionUnionType {
  kind: 'UNION';
  name: string;
  description?: string;
  possibleTypes: Array<IntrospectionNamedTypeRef>;
}

interface IntrospectionEnumType {
  kind: 'ENUM';
  name: string;
  description?: string;
  enumValues: Array<IntrospectionEnumValue>;
}

interface IntrospectionInputObjectType {
  kind: 'INPUT_OBJECT';
  name: string;
  description?: string;
  inputFields: Array<IntrospectionInputValue>;
}

type IntrospectionTypeRef =
  IntrospectionNamedTypeRef |
  IntrospectionListTypeRef |
  IntrospectionNonNullTypeRef

interface IntrospectionNamedTypeRef {
  kind: string;
  name: string;
}

interface IntrospectionListTypeRef {
  kind: 'LIST';
  ofType?: IntrospectionTypeRef;
}

interface IntrospectionNonNullTypeRef {
  kind: 'NON_NULL';
  ofType?: IntrospectionTypeRef;
}

interface IntrospectionField {
  name: string;
  description?: string;
  args: Array<IntrospectionInputValue>;
  type: IntrospectionTypeRef;
  isDeprecated: boolean;
  deprecationReason?: string;
}

interface IntrospectionInputValue {
  name: string;
  description?: string;
  type: IntrospectionTypeRef;
  defaultValue?: string;
}

interface IntrospectionEnumValue {
  name: string;
  description?: string;
  isDeprecated: boolean;
  deprecationReason?: string;
}

interface IntrospectionDirective {
  name: string;
  description?: string;
  locations: Array<DirectiveLocationEnum>;
  args: Array<IntrospectionInputValue>;
}

// utilities/buildClientSchema.js
export function buildClientSchema(
  introspection: IntrospectionQuery
): GraphQLSchema
