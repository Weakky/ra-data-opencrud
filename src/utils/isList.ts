import {
  TypeKind,
  IntrospectionTypeRef,
  IntrospectionNonNullTypeRef
} from 'graphql';

const isList = (type: IntrospectionTypeRef): boolean => {
  if (type.kind === TypeKind.NON_NULL) {
    return isList((type as IntrospectionNonNullTypeRef).ofType!);
  }

  return type.kind === TypeKind.LIST;
};

export default isList;
