import {
  TypeKind,
  IntrospectionTypeRef,
  IntrospectionListTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef
} from 'graphql';

/**
 * Ensure we get the real type even if the root type is NON_NULL or LIST
 * @param {GraphQLType} type
 */
const getFinalType = (
  type: IntrospectionTypeRef
): IntrospectionNamedTypeRef => {
  if (type.kind === TypeKind.NON_NULL || type.kind === TypeKind.LIST) {
    return getFinalType(
      (type as IntrospectionListTypeRef | IntrospectionNonNullTypeRef).ofType!
    );
  }

  return type as IntrospectionNamedTypeRef;
};

export default getFinalType;
