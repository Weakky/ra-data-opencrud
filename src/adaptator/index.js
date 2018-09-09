import camelCase from 'lodash/camelCase';
import merge from 'lodash/merge';
import pluralize from 'pluralize';

import buildDataProvider from 'ra-data-graphql';
import {
  CREATE,
  DELETE,
  DELETE_MANY,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
  UPDATE,
  UPDATE_MANY
} from 'react-admin';

import prismaBuildQuery from './buildQuery';

export const buildQuery = prismaBuildQuery;

const defaultOptions = {
  buildQuery,
  introspection: {
    operationNames: {
      [GET_LIST]: resource => `${pluralize(camelCase(resource.name))}`,
      [GET_ONE]: resource => `${camelCase(resource.name)}`,
      [GET_MANY]: resource => `${pluralize(camelCase(resource.name))}`,
      [GET_MANY_REFERENCE]: resource => `${pluralize(camelCase(resource.name))}`,
      [CREATE]: resource => `create${resource.name}`,
      [UPDATE]: resource => `update${resource.name}`,
      [DELETE]: resource => `delete${resource.name}`
    },
    exclude: undefined,
    include: undefined
  }
};

//TODO: Prisma supports batching (UPDATE_MANY, DELETE_MANY)
export default options => {
  return buildDataProvider(merge({}, defaultOptions, options)).then(graphQLDataProvider => {
    return (fetchType, resource, params) => {
      return graphQLDataProvider(fetchType, resource, params);
    };
  });
};
