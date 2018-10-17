import difference from 'lodash/difference';

type ID = string;

const formatId = (id: ID) => ({ id });

export const computeFieldsToAdd = (oldIds: ID[], newIds: ID[]) => {
  return difference(newIds, oldIds).map(formatId);
};

export const computeFieldsToRemove = (oldIds: ID[], newIds: ID[]) => {
  return difference(oldIds, newIds).map(formatId);
};

export const computeFieldsToUpdate = (oldIds: ID[], newIds: ID[]) => {
  return oldIds.filter(oldId => newIds.includes(oldId)).map(formatId);
};

export const computeFieldsToAddRemoveUpdate = (oldIds: ID[], newIds: ID[]) => ({
  fieldsToAdd: computeFieldsToAdd(oldIds, newIds),
  fieldsToRemove: computeFieldsToRemove(oldIds, newIds),
  fieldsToUpdate: computeFieldsToUpdate(oldIds, newIds)
});
