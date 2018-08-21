import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE
} from 'react-admin';
import getFinalType from './getFinalType';

const buildGetListVariables = introspectionResults => (resource, aorFetchType, params) => {
  const filter = Object.keys(params.filter).reduce((acc, key) => {
    if (key === 'ids') {
      return { ...acc, id_in: params.filter[key] };
    }

    if (typeof params.filter[key] === 'object') {
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

const findFinalType = (introspectionResults, typeName, field) => {
  const type = introspectionResults.types.find(t => t.name === typeName);

  return getFinalType(type.inputFields.find(t => t.name === field));
};

//Duplicated connectFields and updateFields method because of WIP
//one will eventually compute fields to disconnect/connect (when aorFetchType == UPDATE)
//other one will connect/create (when aorFetchType == CREATE)
const updateFields = (inputArg, introspectionResults, typeName, field) => {
  const inputType = findFinalType(introspectionResults, typeName, field);
  const connectInputType = findFinalType(introspectionResults, inputType.type.name, 'connect');

  return Object.keys(inputArg).reduce(
    (acc, key) => {
      const foundInputType = findFinalType(introspectionResults, connectInputType.type.name, key);

      if (!!foundInputType) {
        return {
          ...acc,
          connect: {
            ...acc.connect,
            [key]: inputArg[key]
          }
        };
      }

      return acc;
    },
    {
      connect: {}
    }
  );
};

const connectFields = (inputArg, introspectionResults, typeName, field) => {
  const inputType = findFinalType(introspectionResults, typeName, field);
  const connectInputType = findFinalType(introspectionResults, inputType.type.name, 'connect');

  return Object.keys(inputArg).reduce(
    (acc, key) => {
      const foundInputType = findFinalType(introspectionResults, connectInputType.type.name, key);

      if (!!foundInputType) {
        return {
          ...acc,
          connect: {
            ...acc.connect,
            [key]: inputArg[key]
          }
        };
      }

      return acc;
    },
    {
      connect: {}
    }
  );
};

const buildUpdateVariables = introspectionResults => (resource, aorFetchType, params, queryType) =>
  Object.keys(params.data).reduce((acc, key) => {
    if (!params.data[key]) {
      return acc;
    }

    if (Array.isArray(params.data[key])) {
      // const arg = queryType.args.find(a => a.name === `${key}Ids`);
      //
      // if (arg) {
      //   return {
      //     ...acc,
      //     [`${key}Ids`]: params.data[key].map(({ id }) => id)
      //   };
      // }
      return acc;
    }

    if (typeof params.data[key] === 'object') {
      const fields = updateFields(
        params.data[key],
        introspectionResults,
        `${resource.type.name}UpdateInput`,
        key
      );

      if (Object.keys(fields.connect).length > 0) {
        return {
          ...acc,
          data: {
            ...acc.data,
            [key]: fields
          }
        };
      } else {
        return acc;
      }
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

const buildCreateVariables = introspectionResults => (resource, aorFetchType, params, queryType) =>
  Object.keys(params.data).reduce((acc, key) => {
    if (Array.isArray(params.data[key])) {
      // const arg = queryType.args.find(a => a.name === `${key}Ids`);
      //
      // if (arg) {
      //   return {
      //     ...acc,
      //     [`${key}Ids`]: params.data[key].map(({ id }) => id)
      //   };
      // }
      return acc;
    }

    if (typeof params.data[key] === 'object') {
      const fields = connectFields(
        params.data[key],
        introspectionResults,
        `${resource.type.name}CreateInput`,
        key
      );

      if (Object.keys(fields.connect).length > 0) {
        return {
          ...acc,
          data: {
            ...acc.data,
            [key]: fields
          }
        };
      } else {
        return acc;
      }
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
      if (typeof params.ids[0] === 'object') {
        return {
          where: {
            id_in: params.ids.map(
              objectId => (typeof objectId === 'object' ? objectId.id : objectId)
            )
          }
        };
      }
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
      const updateParams = buildUpdateVariables(introspectionResults)(
        resource,
        aorFetchType,
        params,
        queryType
      );

      //console.log("params", params);
      //console.log("updateParams", updateParams);
      return updateParams;
    }

    case CREATE: {
      const createParams = buildCreateVariables(introspectionResults)(
        resource,
        aorFetchType,
        params,
        queryType
      );

      //console.log("params", params);
      //console.log("createParams", createParams);
      return createParams;
    }

    case DELETE:
      return {
        where: { id: params.id }
      };
  }
};
