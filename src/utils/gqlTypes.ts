import {
  Kind,
  DefinitionNode,
  DocumentNode,
  OperationDefinitionNode,
  OperationTypeNode,
  NameNode,
  VariableDefinitionNode,
  SelectionSetNode,
  SelectionNode,
  FieldDefinitionNode,
  FieldNode,
  ListTypeNode,
  TypeNode,
  NonNullTypeNode,
  NamedTypeNode,
  VariableNode,
  ValueNode,
  ArgumentNode
} from 'graphql';

// Functional utils to easily build GraphQL ASTs
// Inspired by https://github.com/imranolas/graphql-ast-types

export const document = (definitions: DefinitionNode[]): DocumentNode => ({
  kind: Kind.DOCUMENT,
  definitions
});

export const operationDefinition = (
  operation: OperationTypeNode,
  selectionSet: SelectionSetNode,
  name: NameNode,
  variableDefinitions: VariableDefinitionNode[]
): OperationDefinitionNode => ({
  kind: Kind.OPERATION_DEFINITION,
  operation,
  selectionSet,
  name,
  variableDefinitions
});

export const selectionSet = (
  selections: SelectionNode[]
): SelectionSetNode => ({
  kind: Kind.SELECTION_SET,
  selections
});

export const field = (
  name: NameNode,
  optionalValues: Partial<FieldNode> = {}
): FieldNode => ({
  kind: Kind.FIELD,
  name,
  ...optionalValues
});

export const listType = (type: TypeNode): ListTypeNode => ({
  kind: Kind.LIST_TYPE,
  type
});

export const nonNullType = (
  type: NamedTypeNode | ListTypeNode
): NonNullTypeNode => ({
  kind: Kind.NON_NULL_TYPE,
  type
});

export const variableDefinition = (
  variable: VariableNode,
  type: TypeNode
): VariableDefinitionNode => ({
  kind: Kind.VARIABLE_DEFINITION,
  variable,
  type
});

export const variable = (name: NameNode): VariableNode => ({
  kind: Kind.VARIABLE,
  name
});

export const name = (value: string): NameNode => ({
  kind: Kind.NAME,
  value
});

export const namedType = (name: NameNode): NamedTypeNode => ({
  kind: Kind.NAMED_TYPE,
  name
});

export const argument = (name: NameNode, value: ValueNode): ArgumentNode => ({
  kind: Kind.ARGUMENT,
  name,
  value
});
