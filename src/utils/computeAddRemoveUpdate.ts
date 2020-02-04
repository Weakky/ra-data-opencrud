import differencWith from 'lodash/differencewith';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';

type Entry = string | object;

const formatEntry = (id: Entry) => {
  if (isString(id)) {
    return { id };
  } else {
    return id;
  }
};

const computeFieldsToAdd = (oldArray: Entry[], newArray: Entry[]) => {
  return differencWith(newArray, oldArray, isEqual).map(formatEntry);
};

const computeFieldsToRemove = (oldArray: Entry[], newArray: Entry[]) => {
  return differencWith(oldArray, newArray, isEqual).map(formatEntry);
};

/*
const computeFieldsToUpdate = (oldArray: Entry[], newArray: Entry[]) => {
  return oldArray.filter(oldId => newArray.includes(oldId)).map(formatEntry);
};
*/

export const computeFieldsToAddRemoveUpdate = (
  oldArray: Entry[],
  newArray: Entry[]
) => ({
  fieldsToAdd: computeFieldsToAdd(oldArray, newArray),
  fieldsToRemove: computeFieldsToRemove(oldArray, newArray)
  //fieldsToUpdate: computeFieldsToUpdate(oldArray, newArray)
});
