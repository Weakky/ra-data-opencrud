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
import { Resource } from './constants/interfaces';
import { ApolloClient, ApolloClientOptions } from 'apollo-client';

export const buildQuery = prismaBuildQuery;

const defaultOptions = {
  buildQuery,
  introspection: {
    operationNames: {
      [GET_LIST]: (resource: Resource) =>
        `${pluralize(camelCase(resource.name))}`,
      [GET_ONE]: (resource: Resource) => `${camelCase(resource.name)}`,
      [GET_MANY]: (resource: Resource) =>
        `${pluralize(camelCase(resource.name))}`,
      [GET_MANY_REFERENCE]: (resource: Resource) =>
        `${pluralize(camelCase(resource.name))}`,
      [CREATE]: (resource: Resource) => `create${resource.name}`,
      [UPDATE]: (resource: Resource) => `update${resource.name}`,
      [DELETE]: (resource: Resource) => `delete${resource.name}`
    },
    exclude: undefined,
    include: undefined
  }
};

//TODO: Prisma supports batching (UPDATE_MANY, DELETE_MANY)
export default (options: {
  client?: ApolloClient<any>;
  clientOptions?: ApolloClientOptions<any>;
}) => {
  return buildDataProvider(merge({}, defaultOptions, options)).then(
    graphQLDataProvider => {
      return (
        fetchType: string,
        resource: string,
        params: { [key: string]: any }
      ): Promise<any> => {
        // Temporary work-around until we make use of updateMany and deleteMany mutations
        if (fetchType === DELETE_MANY) {
          const { ids, ...otherParams } = params;
          return Promise.all(
            params.ids.map((id: string) =>
              graphQLDataProvider(DELETE, resource, {
                id,
                ...otherParams
              })
            )
          ).then(results => {
            return { data: results.map(({ data }: any) => data.id) };
          });
        }

        if (fetchType === UPDATE_MANY) {
          const { ids, ...otherParams } = params;
          return Promise.all(
            params.ids.map((id: string) =>
              graphQLDataProvider(UPDATE, resource, {
                id,
                ...otherParams
              })
            )
          ).then(results => {
            return { data: results.map(({ data }: any) => data.id) };
          });
        }
        return graphQLDataProvider(fetchType, resource, params);
      };
    }
  );
};
