import { TypeKind, parse } from 'graphql';
import { QUERY_TYPES } from 'ra-data-graphql';
import { GET_LIST, GET_MANY, GET_MANY_REFERENCE, DELETE } from 'react-admin';

import * as gqlTypes from './utils/gqlTypes';
import getFinalType from './utils/getFinalType';
import isList from './utils/isList';
import isRequired from './utils/isRequired';

export const buildFields = introspectionResults => fields => {
  return fields.reduce((acc, field) => {
    const type = getFinalType(field.type);

    if (type.name.startsWith('_')) {
      return acc;
    }

    if (type.kind !== TypeKind.OBJECT) {
      return [...acc, gqlTypes.field(gqlTypes.name(field.name))];
    }

    const linkedResource = introspectionResults.resources.find(
      r => r.type.name === type.name
    );

    if (linkedResource) {
      return [
        ...acc,
        gqlTypes.field(gqlTypes.name(field.name), {
          selectionSet: gqlTypes.selectionSet([
            gqlTypes.field(gqlTypes.name('id'))
          ])
        })
      ];
    }

    const linkedType = introspectionResults.types.find(
      t => t.name === type.name
    );

    if (linkedType) {
      return [
        ...acc,
        gqlTypes.field(gqlTypes.name(field.name), {
          selectionSet: gqlTypes.selectionSet(
            buildFields(introspectionResults)(linkedType.fields)
          )
        })
      ];
    }

    // NOTE: We might have to handle linked types which are not resources but will have to be careful about
    // ending with endless circular dependencies
    return acc;
  }, []);
};

export const getArgType = arg => {
  const type = getFinalType(arg.type);
  const required = isRequired(arg.type);
  const list = isList(arg.type);

  if (list) {
    if (required) {
      return gqlTypes.listType(
        gqlTypes.nonNullType(
          gqlTypes.namedType(gqlTypes.name(type.name))
        )
      );
    }
    return gqlTypes.listType(gqlTypes.namedType(gqlTypes.name(type.name)));
  }

  if (required) {
    return gqlTypes.nonNullType(
      gqlTypes.namedType(gqlTypes.name(type.name))
    );
  }

  return gqlTypes.namedType(gqlTypes.name(type.name));
};

export const buildArgs = (query, variables) => {
  if (query.args.length === 0) {
    return [];
  }

  const validVariables = Object.keys(variables).filter(
    k => typeof variables[k] !== 'undefined'
  );
  return query.args
    .filter(arg => validVariables.includes(arg.name))
    .reduce(
      (acc, arg) => [
        ...acc,
        gqlTypes.argument(
          gqlTypes.name(arg.name),
          gqlTypes.variable(gqlTypes.name(arg.name))
        )
      ],
      []
    );
};

export const buildApolloArgs = (query, variables) => {
  if (query.args.length === 0) {
    return [];
  }

  const validVariables = Object.keys(variables).filter(
    k => typeof variables[k] !== 'undefined'
  );

  return query.args
    .filter(arg => validVariables.includes(arg.name))
    .reduce((acc, arg) => [
      ...acc,
      gqlTypes.variableDefinition(
        gqlTypes.variable(gqlTypes.name(arg.name)),
        getArgType(arg)
      )
    ], []);
};

//TODO: validate fragment against the schema
const buildFieldsFromFragment = (fragment, resourceName, fetchType) => {
  let parsedFragment = {};

  if (
    typeof fragment === 'object' &&
    fragment.kind &&
    fragment.kind === 'Document'
  ) {
    parsedFragment = fragment;
  }

  if (typeof fragment === 'string') {
    if (!fragment.startsWith('fragment')) {
      fragment = `fragment tmp on ${resourceName} ${fragment}`;
    }

    try {
      parsedFragment = parse(fragment);
    } catch (e) {
      throw new Error(
        `Invalid fragment given for resource '${resourceName}' and fetchType '${fetchType}' (${
          e.message
        }).`
      );
    }
  }

  return parsedFragment.definitions[0].selectionSet.selections;
};

export default introspectionResults => (
  resource,
  aorFetchType,
  queryType,
  variables,
  fragment
) => {
  const { sortField, sortOrder, ...countVariables } = variables;
  const apolloArgs = buildApolloArgs(queryType, variables);
  const args = buildArgs(queryType, variables);
  const countArgs = buildArgs(queryType, countVariables);
  const fields = !!fragment
    ? buildFieldsFromFragment(fragment, resource.type.name, aorFetchType)
    : buildFields(introspectionResults)(resource.type.fields);

  if (
    aorFetchType === GET_LIST ||
    aorFetchType === GET_MANY ||
    aorFetchType === GET_MANY_REFERENCE
  ) {
    return gqlTypes.document([
      gqlTypes.operationDefinition(
        'query',
        gqlTypes.selectionSet([
          gqlTypes.field(gqlTypes.name(queryType.name), {
            alias: gqlTypes.name('items'),
            arguments: args,
            selectionSet: gqlTypes.selectionSet(fields)
          }),
          gqlTypes.field(gqlTypes.name(`${queryType.name}Connection`), {
            alias: gqlTypes.name('total'),
            arguments: countArgs,
            selectionSet: gqlTypes.selectionSet([
              gqlTypes.field(gqlTypes.name('aggregate'), {
                selectionSet: gqlTypes.selectionSet([gqlTypes.field(gqlTypes.name('count'))])
              })
            ])
          })
        ]),
        gqlTypes.name(queryType.name),
        apolloArgs
      )
    ]);
  }

  if (aorFetchType === DELETE) {
    return gqlTypes.document([
      gqlTypes.operationDefinition(
        'mutation',
        gqlTypes.selectionSet([
          gqlTypes.field(gqlTypes.name(queryType.name), {
            alias: gqlTypes.name('data'),
            arguments: args,
            selectionSet: gqlTypes.selectionSet([
              gqlTypes.field(gqlTypes.name('id'))
            ])
          })
        ]),
        gqlTypes.name(queryType.name),
        apolloArgs
      )
    ]);
  }

  return gqlTypes.document([
    gqlTypes.operationDefinition(
      QUERY_TYPES.includes(aorFetchType) ? 'query' : 'mutation',
      gqlTypes.selectionSet([
        gqlTypes.field(gqlTypes.name(queryType.name), {
          alias: gqlTypes.name('data'),
          arguments: args,
          selectionSet: gqlTypes.selectionSet(fields)
        }),
      ]),
      gqlTypes.name(queryType.name),
      apolloArgs
    )
  ]);
};
