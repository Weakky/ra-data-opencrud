import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE
} from 'react-admin';

import isObject from 'lodash/isObject';

import getFinalType from './utils/getFinalType';
import { computeFieldsToAddRemoveUpdate } from './utils/computeAddRemoveUpdate';

import { PRISMA_CONNECT, PRISMA_DISCONNECT, PRISMA_UPDATE } from './constants/mutations';

//TODO: Object filter weren't tested yet
const buildGetListVariables = introspectionResults => (resource, aorFetchType, params) => {
  const filter = Object.keys(params.filter).reduce((acc, key) => {
    if (key === 'ids') {
      return { ...acc, id_in: params.filter[key] };
    }

    if (Array.isArray(params.filter[key])) {
      const type = introspectionResults.types.find(
        t => t.name === `${resource.type.name}WhereInput`
      );
      const inputField = type.inputFields.find(t => t.name === key);

      if (!!inputField) {
        return {
          ...acc,
          [key]: { id_in: params.filter[key] }
        };
      }
    }

    if (isObject(params.filter[key])) {
      const type = introspectionResults.types.find(
        t => t.name === `${resource.type.name}WhereInput`
      );
      const filterSome = type.inputFields.find(t => t.name === `${key}_some`);

      if (filterSome) {
        const filter = Object.keys(params.filter[key]).reduce(
          (acc, k) => ({
            ...acc,
            [`${k}_in`]: params.filter[key][k]
          }),
          {}
        );
        return { ...acc, [`${key}_some`]: filter };
      }
    }

    const parts = key.split('.');

    if (parts.length > 1) {
      if (parts[1] == 'id') {
        const type = introspectionResults.types.find(
          t => t.name === `${resource.type.name}WhereInput`
        );
        const filterSome = type.inputFields.find(t => t.name === `${parts[0]}_some`);

        if (filterSome) {
          return {
            ...acc,
            [`${parts[0]}_some`]: { id: params.filter[key] }
          };
        }

        return { ...acc, [parts[0]]: { id: params.filter[key] } };
      }

      const resourceField = resource.type.fields.find(f => f.name === parts[0]);
      if (resourceField.type.name === 'Int') {
        return { ...acc, [key]: parseInt(params.filter[key]) };
      }
      if (resourceField.type.name === 'Float') {
        return { ...acc, [key]: parseFloat(params.filter[key]) };
      }
    }

    return { ...acc, [key]: params.filter[key] };
  }, {});

  return {
    skip: parseInt((params.pagination.page - 1) * params.pagination.perPage),
    first: parseInt(params.pagination.perPage),
    orderBy: `${params.sort.field}_${params.sort.order}`,
    where: filter
  };
};

const findInputFieldForType = (introspectionResults, typeName, field) => {
  const type = introspectionResults.types.find(t => t.name === typeName);

  if (!type) {
    return null;
  }

  const inputFieldType = type.inputFields.find(t => t.name === field);

  return !!inputFieldType ? getFinalType(inputFieldType.type) : null;
};

const inputFieldExistsForType = (introspectionResults, typeName, field) => {
  return !!findInputFieldForType(introspectionResults, typeName, field);
};

const buildReferenceField = ({ inputArg, introspectionResults, typeName, field, mutationType }) => {
  const inputType = findInputFieldForType(introspectionResults, typeName, field);
  const mutationInputType = findInputFieldForType(
    introspectionResults,
    inputType.name,
    mutationType
  );

  return Object.keys(inputArg).reduce((acc, key) => {
    return inputFieldExistsForType(introspectionResults, mutationInputType.name, key)
      ? { ...acc, [key]: inputArg[key] }
      : acc;
  }, {});
};

const buildUpdateVariables = introspectionResults => (resource, aorFetchType, params) => {
  return Object.keys(params.data).reduce((acc, key) => {
    if (!params.data[key]) {
      return acc;
    }

    if (Array.isArray(params.data[key])) {
      const inputType = findInputFieldForType(
        introspectionResults,
        `${resource.type.name}UpdateInput`,
        key
      );

      if (!inputType) {
        return acc;
      }

      //TODO: Make connect, disconnect and update overridable
      //TODO: Make updates working
      const { fieldsToAdd, fieldsToRemove, fieldsToUpdate } = computeFieldsToAddRemoveUpdate(
        params.previousData[`${key}Ids`],
        params.data[`${key}Ids`]
      );

      return {
        ...acc,
        data: {
          ...acc.data,
          [key]: {
            [PRISMA_CONNECT]: fieldsToAdd,
            [PRISMA_DISCONNECT]: fieldsToRemove,
            //[PRISMA_UPDATE]: fieldsToUpdate
          }
        }
      };
    }

    if (isObject(params.data[key])) {
      const fieldsToUpdate = buildReferenceField({
        inputArg: params.data[key],
        introspectionResults,
        typeName: `${resource.type.name}UpdateInput`,
        field: key,
        mutationType: PRISMA_CONNECT
      });

      // If no fields in the object are valid, continue
      if (Object.keys(fieldsToUpdate).length === 0) {
        return acc;
      }

      // Else, connect the nodes
      return { ...acc, data: { ...acc.data, [key]: { [PRISMA_CONNECT]: { ...fieldsToUpdate } } } };
    }

    // Put id field in a where object
    if (key === 'id' && params.data[key]) {
      return {
        ...acc,
        where: {
          id: params.data[key]
        }
      };
    }

    const type = introspectionResults.types.find(t => t.name === resource.type.name);
    const isInField = type.fields.find(t => t.name === key);

    if (!!isInField) {
      // Rest should be put in data object
      return {
        ...acc,
        data: {
          ...acc.data,
          [key]: params.data[key]
        }
      };
    }

    return acc;
  }, {});
};

const buildCreateVariables = introspectionResults => (resource, aorFetchType, params) =>
  Object.keys(params.data).reduce((acc, key) => {
    if (Array.isArray(params.data[key])) {
      if (!inputFieldExistsForType(introspectionResults, `${resource.type.name}CreateInput`, key)) {
        return acc;
      }

      return {
        ...acc,
        data: {
          ...acc.data,
          [key]: {
            [PRISMA_CONNECT]: params.data[`${key}Ids`].map(id => ({ id }))
          }
        }
      };
    }

    if (isObject(params.data[key])) {
      const fieldsToConnect = buildReferenceField({
        inputArg: params.data[key],
        introspectionResults,
        typeName: `${resource.type.name}UpdateInput`,
        field: key,
        mutationType: PRISMA_CONNECT
      });

      // If no fields in the object are valid, continue
      if (Object.keys(fieldsToConnect).length === 0) {
        return acc;
      }

      // Else, connect the nodes
      return { ...acc, data: { ...acc.data, [key]: { [PRISMA_CONNECT]: { ...fieldsToConnect } } } };
    }

    // Put id field in a where object
    if (key === 'id' && params.data[key]) {
      return {
        ...acc,
        where: {
          id: params.data[key]
        }
      };
    }

    const type = introspectionResults.types.find(t => t.name === resource.type.name);
    const isInField = type.fields.find(t => t.name === key);

    if (isInField) {
      // Rest should be put in data object
      return {
        ...acc,
        data: {
          ...acc.data,
          [key]: params.data[key]
        }
      };
    }

    return acc;
  }, {});

export default introspectionResults => (resource, aorFetchType, params, queryType) => {
  switch (aorFetchType) {
    case GET_LIST: {
      return buildGetListVariables(introspectionResults)(resource, aorFetchType, params, queryType);
    }
    case GET_MANY:
      return {
        where: { id_in: params.ids }
      };
    case GET_MANY_REFERENCE: {
      const parts = params.target.split('.');

      return {
        where: { [parts[0]]: { id: params.id } }
      };
    }
    case GET_ONE:
      return {
        where: { id: params.id }
      };
    case UPDATE: {
      return buildUpdateVariables(introspectionResults)(resource, aorFetchType, params);
    }

    case CREATE: {
      return buildCreateVariables(introspectionResults)(resource, aorFetchType, params);
    }

    case DELETE:
      return {
        where: { id: params.id }
      };
  }
};
