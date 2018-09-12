import { Kind } from 'graphql';

// Functional utils to easily build GraphQL ASTs
// Inspired by https://github.com/imranolas/graphql-ast-types

export const document = (definitions) => ({
  kind: Kind.DOCUMENT,
  definitions
});

export const operationDefinition = (operation, selectionSet, name, variableDefinitions) => ({
  kind: Kind.OPERATION_DEFINITION,
  operation,
  selectionSet,
  name,
  variableDefinitions
});

export const selectionSet = (selections) => ({
  kind: Kind.SELECTION_SET,
  selections
});

export const field = (name, optionalValues = {}) => ({
  kind: Kind.FIELD,
  name,
  ...optionalValues
});

export const listType = (type) => ({
  kind: Kind.LIST_TYPE,
  type
});

export const nonNullType = (type) => ({
  kind: Kind.NON_NULL_TYPE,
  type
});

export const variableDefinition = (variable, type) => ({
  kind: Kind.VARIABLE_DEFINITION,
  variable,
  type
});

export const variable = (name) => ({
  kind: Kind.VARIABLE,
  name
});

export const name = (value) => ({
  kind: Kind.NAME,
  value
});

export const namedType = (name) => ({
  kind: Kind.NAMED_TYPE,
  name
});

export const argument = (name, value) => ({
  kind: Kind.ARGUMENT,
  name,
  value
});
