import {
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE
} from 'react-admin';
import buildVariables from './buildVariables';
import { TypeKind } from 'graphql/type/introspection';

describe('buildVariables', () => {
  describe('GET_LIST', () => {
    it('returns correct variables', () => {
      const introspectionResult = {
        types: [
          {
            name: 'PostWhereInput',
            inputFields: [{ name: 'tags_some' }]
          }
        ]
      };
      const params = {
        filter: {
          ids: ['foo1', 'foo2'],
          tags: { id: ['tag1', 'tag2'] },
          'author.id': 'author1',
          views: 100
        },
        pagination: { page: 10, perPage: 10 },
        sort: { field: 'sortField', order: 'DESC' }
      };

      expect(
        buildVariables(introspectionResult)(
          { type: { name: 'Post' } },
          GET_LIST,
          params,
          {}
        )
      ).toEqual({
        where: {
          id_in: ['foo1', 'foo2'],
          tags_some: { id_in: ['tag1', 'tag2'] },
          author: { id: 'author1' },
          views: 100
        },
        first: 10,
        orderBy: 'sortField_DESC',
        skip: 90
      });
    });
  });

  describe('CREATE', () => {
    it('returns correct variables', () => {
      const introspectionResult = {
        types: [
          {
            name: 'Post',
            fields: [
              {
                name: 'title'
              }
            ]
          },
          {
            name: 'PostCreateInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'author',
                type: {
                  kind: TypeKind.NON_NULL,
                  ofType: {
                    kind: TypeKind.INPUT_OBJECT,
                    name: 'AuthorCreateOneInput'
                  }
                }
              },
              {
                name: 'tags',
                type: {
                  kind: TypeKind.NON_NULL,
                  ofType: {
                    kind: TypeKind.INPUT_OBJECT,
                    name: 'TagCreateManyInput'
                  }
                }
              }
            ]
          },
          {
            name: 'AuthorCreateOneInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'connect',
                type: {
                  kind: TypeKind.NON_NULL,
                  ofType: {
                    kind: TypeKind.INPUT_OBJECT,
                    name: 'AuthorWhereUniqueInput'
                  }
                }
              }
            ]
          },
          {
            name: 'AuthorWhereUniqueInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'id',
                type: {
                  kind: TypeKind.SCALAR,
                  name: 'String'
                }
              }
            ]
          },
          {
            name: 'TagCreateManyInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'connect',
                type: {
                  kind: TypeKind.NON_NULL,
                  ofType: {
                    kind: TypeKind.INPUT_OBJECT,
                    name: 'TagWhereUniqueInput'
                  }
                }
              }
            ]
          },
          {
            name: 'TagWhereUniqueInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'id',
                type: {
                  kind: TypeKind.SCALAR,
                  name: 'String'
                }
              }
            ]
          },
        ]
      };

      const params = {
        data: {
          author: { id: 'author1' },
          title: 'Foo',
          tags: [{ id: 'tags1' }, { id: 'tags2' }],
          tagsIds: ['tags1', 'tags2']
        }
      };

      expect(
        buildVariables(introspectionResult)(
          { type: { name: 'Post' } },
          CREATE,
          params
        )
      ).toEqual({
        data: {
          author: { connect: { id: 'author1' } },
          tags: {
            connect: [{ id: 'tags1' }, { id: 'tags2' }]
          },
          title: 'Foo'
        }
      });
    });
  });

  describe('UPDATE', () => {
    it('returns correct variables', () => {
      const introspectionResult = {
        types: [
          {
            name: 'Post',
            fields: [{ name: 'title' }]
          },
          {
            name: 'PostUpdateInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'author',
                type: {
                  kind: TypeKind.NON_NULL,
                  ofType: {
                    kind: TypeKind.INPUT_OBJECT,
                    name: 'AuthorUpdateOneInput'
                  }
                }
              },
              {
                name: 'tags',
                type: {
                  kind: TypeKind.NON_NULL,
                  ofType: {
                    kind: TypeKind.INPUT_OBJECT,
                    name: 'TagsUpdateManyInput'
                  }
                }
              }
            ]
          },
          {
            name: 'AuthorUpdateOneInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'connect',
                type: {
                  kind: TypeKind.NON_NULL,
                  ofType: {
                    kind: TypeKind.INPUT_OBJECT,
                    name: 'AuthorWhereUniqueInput'
                  }
                }
              }
            ]
          },
          {
            name: 'TagsUpdateManyInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'connect',
                type: {
                  kind: TypeKind.NON_NULL,
                  ofType: {
                    kind: TypeKind.INPUT_OBJECT,
                    name: 'TagsWhereUniqueInput'
                  }
                }
              }
            ]
          },
          {
            name: 'TagsWhereUniqueInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'id',
                type: {
                  kind: TypeKind.SCALAR,
                  name: 'String'
                }
              }
            ]
          },
          {
            name: 'AuthorWhereUniqueInput',
            kind: TypeKind.INPUT_OBJECT,
            inputFields: [
              {
                name: 'id',
                type: {
                  kind: TypeKind.SCALAR,
                  name: 'String'
                }
              }
            ]
          }
        ]
      };

      const params = {
        data: {
          id: 'postId',
          tags: [{ id: 'tags1' }, { id: 'tags2' }],
          tagsIds: ['tags1', 'tags2'],
          author: { id: 'author1' },
          title: 'Foo'
        },
        previousData: {
          tags: [{ id: 'tags1' }],
          tagsIds: ['tags1']
        }
      };

      expect(
        buildVariables(introspectionResult)(
          { type: { name: 'Post' } },
          UPDATE,
          params
        )
      ).toEqual({
        where: { id: 'postId' },
        data: {
          author: { connect: { id: 'author1' } },
          tags: {
            connect: [{ id: 'tags2' }],
            disconnect: []
          },
          title: 'Foo'
        }
      });
    });
  });

  describe('GET_MANY', () => {
    it('returns correct variables', () => {
      const params = {
        ids: ['tag1', 'tag2']
      };

      expect(
        buildVariables()({ type: { name: 'Post' } }, GET_MANY, params, {})
      ).toEqual({
        where: { id_in: ['tag1', 'tag2'] }
      });
    });
  });

  describe('GET_MANY_REFERENCE', () => {
    it('returns correct variables', () => {
      const params = {
        target: 'author.id',
        id: 'author1'
      };

      expect(
        buildVariables()(
          { type: { name: 'Post' } },
          GET_MANY_REFERENCE,
          params,
          {}
        )
      ).toEqual({
        where: { author: { id: 'author1' } }
      });
    });
  });

  describe('DELETE', () => {
    it('returns correct variables', () => {
      const params = {
        id: 'post1'
      };

      expect(
        buildVariables()(
          { type: { name: 'Post', inputFields: [] } },
          DELETE,
          params,
          {}
        )
      ).toEqual({
        where: { id: 'post1' }
      });
    });
  });
});
