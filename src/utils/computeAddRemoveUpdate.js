import difference from 'lodash/difference';

const formatId = (id) => ({ id });

export const computeFieldsToAdd = (oldIds, newIds) => {
  return difference(newIds, oldIds).map(formatId);
};

export const computeFieldsToRemove = (oldIds, newIds) => {
  return difference(oldIds, newIds).map(formatId);
};

export const computeFieldsToUpdate = (oldIds, newIds) => {
  return oldIds.filter(oldId => newIds.includes(oldId)).map(formatId);
};

export const computeFieldsToAddRemoveUpdate = (oldIds, newIds) => ({
  fieldsToAdd: computeFieldsToAdd(oldIds, newIds),
  fieldsToRemove: computeFieldsToRemove(oldIds, newIds),
  fieldsToUpdate: computeFieldsToUpdate(oldIds, newIds),
});
