import {
  TypeKind,
  IntrospectionTypeRef,
  IntrospectionListTypeRef
} from 'graphql';

const isRequired = (type: IntrospectionTypeRef): boolean => {
  if (type.kind === TypeKind.LIST) {
    return isRequired((type as IntrospectionListTypeRef).ofType!);
  }

  return type.kind === TypeKind.NON_NULL;
};

export default isRequired;
