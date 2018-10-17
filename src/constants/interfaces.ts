import { IntrospectionSchema, IntrospectionType } from 'graphql';

export interface Resource {
  type: IntrospectionType;
  [key: string]: any;
}

export interface IntrospectionResult {
  types: IntrospectionType[];
  queries: IntrospectionType[];
  resources: Resource[];
  schema: IntrospectionSchema;
}
