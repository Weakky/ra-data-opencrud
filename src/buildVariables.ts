import {
  IntrospectionInputObjectType,
  IntrospectionListTypeRef,
  IntrospectionNamedTypeRef,
  IntrospectionObjectType
} from 'graphql';
import isObject from 'lodash/isObject';
import {
  CREATE,
  DELETE,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
  UPDATE
} from 'react-admin';
import { IntrospectionResult, Resource } from './constants/interfaces';
import {
  PRISMA_CONNECT,
  PRISMA_CREATE,
  PRISMA_DISCONNECT
} from './constants/mutations';
import { computeFieldsToAddRemoveUpdate } from './utils/computeAddRemoveUpdate';
import getFinalType from './utils/getFinalType';

interface GetListParams {
  filter: { [key: string]: any };
  pagination: { page: number; perPage: number };
  sort: { field: string; order: string };
}

//TODO: Object filter weren't tested yet
const buildGetListVariables = (introspectionResults: IntrospectionResult) => (
  resource: Resource,
  aorFetchType: string,
  params: GetListParams
) => {
  const filter = Object.keys(params.filter).reduce((acc, key) => {
    if (key === 'ids') {
      return { ...acc, id_in: params.filter[key] };
    }

    if (Array.isArray(params.filter[key])) {
      const type = introspectionResults.types.find(
        t => t.name === `${resource.type.name}WhereInput`
      ) as IntrospectionInputObjectType;
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
      ) as IntrospectionInputObjectType;
      const filterSome = type.inputFields.find(t => t.name === `${key}_some`);

      if (filterSome) {
        const filter = Object.keys(params.filter[key]).reduce(
          (acc, k: string) => ({
            ...acc,
            [`${k}_in`]: params.filter[key][k] as string[]
          }),
          {} as { [key: string]: string[] }
        );
        return { ...acc, [`${key}_some`]: filter };
      }
    }

    const parts = key.split('.');

    if (parts.length > 1) {
      if (parts[1] == 'id') {
        const type = introspectionResults.types.find(
          t => t.name === `${resource.type.name}WhereInput`
        ) as IntrospectionInputObjectType;
        const filterSome = type.inputFields.find(
          t => t.name === `${parts[0]}_some`
        );

        if (filterSome) {
          return {
            ...acc,
            [`${parts[0]}_some`]: { id: params.filter[key] }
          };
        }

        return { ...acc, [parts[0]]: { id: params.filter[key] } };
      }

      const resourceField = (resource.type as IntrospectionObjectType).fields.find(
        f => f.name === parts[0]
      )!;
      if ((resourceField.type as IntrospectionNamedTypeRef).name === 'Int') {
        return { ...acc, [key]: parseInt(params.filter[key]) };
      }
      if ((resourceField.type as IntrospectionNamedTypeRef).name === 'Float') {
        return { ...acc, [key]: parseFloat(params.filter[key]) };
      }
    }

    return { ...acc, [key]: params.filter[key] };
  }, {});

  return {
    skip: (params.pagination.page - 1) * params.pagination.perPage,
    first: params.pagination.perPage,
    orderBy: `${params.sort.field}_${params.sort.order}`,
    where: filter
  };
};

const findInputFieldForType = (
  introspectionResults: IntrospectionResult,
  typeName: string,
  field: string
) => {
  const type = introspectionResults.types.find(
    t => t.name === typeName
  ) as IntrospectionInputObjectType;

  if (!type) {
    return null;
  }

  const inputFieldType = type.inputFields.find(t => t.name === field);

  return !!inputFieldType ? getFinalType(inputFieldType.type) : null;
};

const inputFieldExistsForType = (
  introspectionResults: IntrospectionResult,
  typeName: string,
  field: string
): boolean => {
  return !!findInputFieldForType(introspectionResults, typeName, field);
};

const findMutationInputType = (
  introspectionResults: IntrospectionResult,
  typeName: string,
  field: string,
  mutationType: string
) => {
  const inputType = findInputFieldForType(
    introspectionResults,
    typeName,
    field
  );
  return findInputFieldForType(
    introspectionResults,
    inputType!.name,
    mutationType
  );
};

const hasMutationInputType = (
  introspectionResults: IntrospectionResult,
  typeName: string,
  field: string,
  mutationType: string
) => {
  return Boolean(
    findMutationInputType(introspectionResults, typeName, field, mutationType)
  );
};

const buildReferenceField = ({
  inputArg,
  introspectionResults,
  typeName,
  field,
  mutationType
}: {
  inputArg: { [key: string]: any };
  introspectionResults: IntrospectionResult;
  typeName: string;
  field: string;
  mutationType: string;
}) => {
  const mutationInputType = findMutationInputType(
    introspectionResults,
    typeName,
    field,
    mutationType
  );

  return Object.keys(inputArg).reduce((acc, key) => {
    return inputFieldExistsForType(
      introspectionResults,
      mutationInputType!.name,
      key
    )
      ? { ...acc, [key]: inputArg[key] }
      : acc;
  }, {});
};

const shouldDisconnect = (inputArg: { [key: string]: any }) => {
  // if inputArg is something like {id: null} or {id: ""}, we need to disconnect
  // TODO: find a better way how to handle this case
  return !Object.keys(inputArg).some(key => Boolean(inputArg[key]));
};

const buildObjectMutationData = ({
  inputArg,
  introspectionResults,
  typeName,
  key,
  type
}: {
  inputArg: { [key: string]: any };
  introspectionResults: IntrospectionResult;
  typeName: string;
  key: string;
  type: 'create' | 'update';
}) => {
  const hasConnect = hasMutationInputType(
    introspectionResults,
    typeName,
    key,
    PRISMA_CONNECT
  );
  if (shouldDisconnect(inputArg)) {
    if (type === 'update') {
      return {
        [key]: {
          [PRISMA_DISCONNECT]: true
        }
      };
    } else {
      // on create, just ignore it. We can't disconnect on create
      return {};
    }
  } else {
    const mutationType = hasConnect ? PRISMA_CONNECT : PRISMA_CREATE;

    const fields = buildReferenceField({
      inputArg,
      introspectionResults,
      typeName,
      field: key,
      mutationType
    });

    // If no fields in the object are valid, continue
    if (Object.keys(fields).length === 0) {
      return {};
    }

    // Else, connect the nodes
    return {
      [key]: { [mutationType]: { ...fields } }
    };
  }
};

interface UpdateParams {
  id: string;
  data: { [key: string]: any };
  previousData: { [key: string]: any };
}

const buildUpdateVariables = (introspectionResults: IntrospectionResult) => (
  resource: Resource,
  aorFetchType: String,
  params: UpdateParams
) => {
  return Object.keys(params.data).reduce((acc, key) => {
    // Put id field in a where object
    if (key === 'id' && params.data[key]) {
      return {
        ...acc,
        where: {
          id: params.data[key]
        }
      };
    }
    const inputType = findInputFieldForType(
      introspectionResults,
      `${resource.type.name}UpdateInput`,
      key
    );

    if (!inputType) {
      return acc;
    }

    if (Array.isArray(params.data[key])) {
      return {
        ...acc,
        data: {
          ...acc.data,
          [key]: {
            ...buildListMutationData({
              key,
              previousData: params.previousData,
              data: params.data,
              introspectionResults,
              inputType
            })
          }
        }
      };
    }

    if (isObject(params.data[key])) {
      if (inputType.kind !== 'SCALAR') {
        const typeName = `${resource.type.name}UpdateInput`;

        const data = buildObjectMutationData({
          inputArg: params.data[key],
          introspectionResults,
          typeName,
          key,
          type: 'update'
        });
        return {
          ...acc,
          data: {
            ...acc.data,
            ...data
          }
        };
      }
    }

    const type = introspectionResults.types.find(
      t => t.name === resource.type.name
    ) as IntrospectionObjectType;
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
  }, {} as { [key: string]: any });
};

const buildListMutationData = ({
  key,
  data,
  previousData,
  introspectionResults,
  inputType
}: {
  key: string;
  data: { [key: string]: any };
  previousData?: { [key: string]: any };
  introspectionResults: IntrospectionResult;
  inputType: IntrospectionNamedTypeRef;
}) => {
  // is it a reference field or an array of objects?
  const rawinputType = introspectionResults.types.find(
    t => t.name === inputType.name
  );
  const isEmbeddedReference =
    rawinputType &&
    rawinputType.kind === 'INPUT_OBJECT' &&
    rawinputType.inputFields.some(f => f.name === 'connect');

  if (isEmbeddedReference) {
    const {
      fieldsToAdd,
      fieldsToRemove /* fieldsToUpdate */
    } = computeFieldsToAddRemoveUpdate(
      previousData?.[`${key}Ids`] ?? [],
      data[`${key}Ids`] ?? []
    );
    if (previousData) {
      return {
        [PRISMA_CONNECT]: fieldsToAdd,
        [PRISMA_DISCONNECT]: fieldsToRemove
      };
    } else {
      return {
        [PRISMA_CONNECT]: fieldsToAdd
      };
    }
  } else {
    let listData = data[key];
    // get listItem type
    if (rawinputType?.kind === 'INPUT_OBJECT') {
      const createInputType = rawinputType.inputFields.find(
        f => f.name === 'create'
      );
      const listType = (createInputType?.type as IntrospectionListTypeRef)
        .ofType as IntrospectionListTypeRef;
      const listItemTypeName = (listType.ofType as IntrospectionNamedTypeRef)
        .name;
      const listItemType = introspectionResults.types.find(
        t => t.name === listItemTypeName
      ) as IntrospectionInputObjectType;
      listData = listData.map((item: { [x: string]: any }) => {
        return Object.keys(item).reduce((acc, key) => {
          const value = item[key];
          const type = listItemType.inputFields.find(f => f.name === key);

          if (type?.type.kind === 'INPUT_OBJECT') {
            return {
              ...acc,
              [key]: {
                create: value
              }
            };
          } else {
            return {
              ...acc,
              [key]: value
            };
          }
        }, {});
      });
    }

    return {
      [PRISMA_CREATE]: listData
    };
  }
};

interface CreateParams {
  data: { [key: string]: any };
}
const buildCreateVariables = (introspectionResults: IntrospectionResult) => (
  resource: Resource,
  aorFetchType: string,
  params: CreateParams
) =>
  Object.keys(params.data).reduce((acc, key) => {
    // Put id field in a where object
    if (key === 'id' && params.data[key]) {
      return {
        ...acc,
        where: {
          id: params.data[key]
        }
      };
    }

    const inputType = findInputFieldForType(
      introspectionResults,
      `${resource.type.name}CreateInput`,
      key
    );
    if (!inputType) {
      return acc;
    }
    if (Array.isArray(params.data[key])) {
      return {
        ...acc,
        data: {
          ...acc.data,
          [key]: {
            ...buildListMutationData({
              key,
              data: params.data,
              introspectionResults,
              inputType
            })
          }
        }
      };
    }

    if (isObject(params.data[key])) {
      if (!inputType) {
        return acc;
      }

      if (inputType.kind !== 'SCALAR') {
        const typeName = `${resource.type.name}CreateInput`;
        const data = buildObjectMutationData({
          inputArg: params.data[key],
          introspectionResults,
          typeName,
          key,
          type: 'create'
        });
        return {
          ...acc,
          data: {
            ...acc.data,
            ...data
          }
        };
      }
    }
    const type = introspectionResults.types.find(
      t => t.name === resource.type.name
    ) as IntrospectionObjectType;
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
  }, {} as { [key: string]: any });

export default (introspectionResults: IntrospectionResult) => (
  resource: Resource,
  aorFetchType: string,
  params: any
) => {
  switch (aorFetchType) {
    case GET_LIST: {
      return buildGetListVariables(introspectionResults)(
        resource,
        aorFetchType,
        params
      );
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
      return buildUpdateVariables(introspectionResults)(
        resource,
        aorFetchType,
        params
      );
    }

    case CREATE: {
      return buildCreateVariables(introspectionResults)(
        resource,
        aorFetchType,
        params
      );
    }

    case DELETE:
      return {
        where: { id: params.id }
      };
  }
};
