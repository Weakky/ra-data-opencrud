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

import buildQuery from './buildQuery';

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
  return buildDataProvider(merge({}, defaultOptions, options)).then(defaultDataProvider => {
    return (fetchType, resource, params) => {
      // Graphcool does not support multiple deletions so instead we send multiple DELETE requests
      // This can be optimized using the apollo-link-batch-http link
      if (fetchType === DELETE_MANY) {
        const { ids, ...otherParams } = params;
        return Promise.all(
          params.ids.map(id =>
            defaultDataProvider(DELETE, resource, {
              id,
              ...otherParams
            })
          )
        ).then(results => {
          const data = results.reduce((acc, { data }) => [...acc, data.id], []);

          return { data };
        });
      }
      // Graphcool does not support multiple deletions so instead we send multiple UPDATE requests
      // This can be optimized using the apollo-link-batch-http link
      if (fetchType === UPDATE_MANY) {
        const { ids, ...otherParams } = params;
        return Promise.all(
          params.ids.map(id =>
            defaultDataProvider(UPDATE, resource, {
              id,
              ...otherParams
            })
          )
        ).then(results => {
          const data = results.reduce((acc, { data }) => [...acc, data.id], []);

          return { data };
        });
      }

      return defaultDataProvider(fetchType, resource, params);
    };
  });
};
