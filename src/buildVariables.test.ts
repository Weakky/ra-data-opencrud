import { TypeKind } from 'graphql/type/introspection';
import {
  CREATE,
  DELETE,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  UPDATE
} from 'react-admin';
import buildVariables from './buildVariables';
import { IntrospectionResult, Resource } from './constants/interfaces';

describe('buildVariables', () => {
  describe('GET_LIST', () => {
    it('returns correct variables', () => {
      const introspectionResult = {
        types: [
          {
            kind: 'INPUT_OBJECT',
            name: 'PostWhereInput',
            inputFields: [{ name: 'tags_some', type: { kind: '', name: '' } }]
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
        buildVariables(introspectionResult as IntrospectionResult)(
          { type: { name: 'Post' } } as Resource,
          GET_LIST,
          params
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
                name: 'title',
                type: {
                  kind: TypeKind.SCALAR,
                  name: 'String'
                }
              },
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
          }
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
        buildVariables(introspectionResult as IntrospectionResult)(
          { type: { name: 'Post' } } as Resource,
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
                name: 'title',
                type: {
                  kind: TypeKind.SCALAR,
                  name: 'String'
                }
              },
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
        buildVariables(introspectionResult as IntrospectionResult)(
          { type: { name: 'Post' } } as Resource,
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

    it('should handle objects in lists correctly', () => {
      // this is taken from a realworlds example
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
                name: 'title',
                type: {
                  kind: TypeKind.SCALAR,
                  name: 'String'
                }
              },
              {
                name: 'imageGallery',

                type: {
                  kind: 'INPUT_OBJECT',
                  name: 'ImageGalleryItemUpdateManyInput'
                }
              }
            ]
          },

          {
            kind: 'INPUT_OBJECT',
            name: 'ImageGalleryItemUpdateManyInput',

            inputFields: [
              {
                name: 'create',

                type: {
                  kind: 'LIST',

                  ofType: {
                    kind: 'NON_NULL',

                    ofType: {
                      kind: 'INPUT_OBJECT',
                      name: 'ImageGalleryItemCreateInput'
                    }
                  }
                }
              }
            ]
          },
          {
            kind: 'INPUT_OBJECT',
            name: 'ImageGalleryItemCreateInput',

            inputFields: [
              {
                name: 'caption',

                type: {
                  kind: 'SCALAR',
                  name: 'String'
                }
              },
              {
                name: 'image',

                type: {
                  kind: 'INPUT_OBJECT',
                  name: 'FileReferenceCreateOneInput'
                }
              }
            ]
          },
          {
            kind: 'INPUT_OBJECT',
            name: 'FileReferenceCreateOneInput',

            inputFields: [
              {
                name: 'create',

                type: {
                  kind: 'INPUT_OBJECT',
                  name: 'FileReferenceCreateInput'
                }
              }
            ]
          },
          {
            kind: 'INPUT_OBJECT',
            name: 'FileReferenceCreateInput',

            inputFields: [
              {
                name: 'bucket',

                type: {
                  kind: 'NON_NULL',

                  ofType: {
                    kind: 'SCALAR',
                    name: 'String'
                  }
                }
              },
              {
                name: 'fileId',

                type: {
                  kind: 'NON_NULL',

                  ofType: {
                    kind: 'SCALAR',
                    name: 'String'
                  }
                }
              }
            ]
          }
        ]
      };

      const params = {
        data: {
          id: 'postId',
          title: 'some title',
          imageGallery: [
            {
              image: {
                fileId: 'someFileId',
                bucket: 'SomeBucket'
              },
              caption: 'some title'
            },
            {
              image: {
                fileId: 'someOtherId',
                bucket: 'SomeBucket'
              },
              caption: 'some other title'
            }
          ]
        },
        previousData: {
          id: 'postId',
          imageGallery: []
        }
      };
      expect(
        buildVariables(introspectionResult as IntrospectionResult)(
          { type: { name: 'Post' } } as Resource,
          UPDATE,
          params
        )
      ).toEqual({
        where: { id: 'postId' },
        data: {
          imageGallery: {
            create: [
              {
                image: {
                  create: {
                    fileId: 'someFileId',
                    bucket: 'SomeBucket'
                  }
                },
                caption: 'some title'
              },
              {
                image: {
                  create: {
                    fileId: 'someOtherId',
                    bucket: 'SomeBucket'
                  }
                },
                caption: 'some other title'
              }
            ]
          },
          title: 'some title'
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
        buildVariables({} as IntrospectionResult)(
          { type: { name: 'Post' } } as Resource,
          GET_MANY,
          params
        )
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
        buildVariables({} as IntrospectionResult)(
          { type: { name: 'Post' } } as Resource,
          GET_MANY_REFERENCE,
          params
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
        buildVariables({} as IntrospectionResult)(
          { type: { name: 'Post', inputFields: [] } } as any,
          DELETE,
          params
        )
      ).toEqual({
        where: { id: 'post1' }
      });
    });
  });
});
