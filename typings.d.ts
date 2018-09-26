declare module 'ra-data-graphql' {
  export const QUERY_TYPES: string[];
  type graphQLDataProvider = (
    fetchType: string,
    resource: string,
    params: { [key: string]: any }
  ) => Promise<any>;
  const buildDataProvider: (options: any) => Promise<graphQLDataProvider>;

  export default buildDataProvider;
}
declare module 'react-admin' {
  export const GET_LIST: string;
  export const GET_ONE: string;
  export const GET_MANY: string;
  export const GET_MANY_REFERENCE: string;
  export const CREATE: string;
  export const UPDATE: string;
  export const DELETE: string;
  export const DELETE_MANY: string;
  export const UPDATE_MANY: string;
}
