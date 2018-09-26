import { buildQueryFactory } from './buildQuery';

describe('buildQuery', () => {
  const queryType = 'query_type';

  const resource = {
    type: { name: 'Post' },
    GET_LIST: queryType
  };
  const introspectionResults = {
    resources: [resource]
  };

  it('throws an error if resource is unknown', () => {
    expect(() =>
      buildQueryFactory()(introspectionResults as any)(
        'GET_LIST',
        'Comment',
        {} as any,
        {} as any
      )
    ).toThrow(
      'Unknown resource Comment. Make sure it has been declared on your server side schema. Known resources are Post'
    );
  });

  it('throws an error if resource does not have a query or mutation for specified AOR fetch type', () => {
    expect(() =>
      buildQueryFactory()(introspectionResults as any)(
        'CREATE',
        'Post',
        {} as any,
        {} as any
      )
    ).toThrow(
      'No query or mutation matching aor fetch type CREATE could be found for resource Post'
    );
  });
});
