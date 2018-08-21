import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
} from 'react-admin';

import pluralize from 'pluralize';
import camelCase from 'lodash/camelCase';

export default {
  operationNames: {
    [GET_LIST]: resource => `${pluralize(camelCase(resource.name))}`,
    [GET_ONE]: resource => `${camelCase(resource.name)}`,
    [GET_MANY]: resource => `${pluralize(camelCase(resource.name))}`,
    [GET_MANY_REFERENCE]: resource => `${pluralize(camelCase(resource.name))}`,
    [CREATE]: resource => `create${resource.name}`,
    [UPDATE]: resource => `update${resource.name}`,
    [DELETE]: resource => `delete${resource.name}`,
  },
  exclude: undefined,
  include: undefined,
}
