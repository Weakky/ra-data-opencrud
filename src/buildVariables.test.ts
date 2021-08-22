import rewire from "rewire"
import { GET_LIST, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE } from "react-admin"
import { TypeKind } from "graphql/type/introspection"
import { IntrospectionResult, Resource } from "./constants/interfaces"

const buildVariables = rewire("./buildVariables")
const buildGetListVariables = buildVariables.__get__("buildGetListVariables")
const findInputFieldForType = buildVariables.__get__("findInputFieldForType")
const inputFieldExistsForType = buildVariables.__get__("inputFieldExistsForType")
const buildReferenceField = buildVariables.__get__("buildReferenceField")
const buildUpdateVariables = buildVariables.__get__("buildUpdateVariables")
const buildCreateVariables = buildVariables.__get__("buildCreateVariables")
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

// @ponicode
describe("buildGetListVariables", () => {
    test("0", () => {
        let object: any = [{ type: undefined, key0: false, key1: false }, { type: undefined, key0: -100, key1: 100, key2: -5.48 }, { type: undefined, key0: -100 }]
        let callFunction: any = () => {
            buildGetListVariables({ types: [undefined], queries: [undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object: any = [{ type: undefined, key0: "This is a Text", key1: "Foo bar", key2: "Hello, world!", key3: "Hello, world!", key4: false }, { type: undefined, key0: 0, key1: true }, { type: undefined, key0: "This is a Text", key1: true }]
        let callFunction: any = () => {
            buildGetListVariables({ types: [undefined, undefined, undefined, undefined], queries: [undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object: any = [{ type: undefined, key0: "This is a Text", key1: "Hello, world!", key2: true }]
        let callFunction: any = () => {
            buildGetListVariables({ types: [undefined, undefined, undefined, undefined], queries: [undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object: any = [{ type: undefined, key0: true, key1: true }, { type: undefined, key0: 1, key1: -5.48, key2: 1 }, { type: undefined, key0: 1 }]
        let callFunction: any = () => {
            buildGetListVariables({ types: [undefined], queries: [undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object: any = [{ type: undefined, key0: true }, { type: undefined }, { type: undefined, key0: false, key1: "Hello, world!", key2: "This is a Text", key3: true }]
        let callFunction: any = () => {
            buildGetListVariables({ types: [undefined, undefined, undefined], queries: [undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            buildGetListVariables({ types: [], queries: [], resources: [], schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("findInputFieldForType", () => {
    test("0", () => {
        let object: any = [{ type: undefined, key0: false, key1: "This is a Text", key2: false }, { type: undefined, key0: "Foo bar", key1: true, key2: 1 }]
        let callFunction: any = () => {
            findInputFieldForType({ types: [undefined], queries: [undefined, undefined, undefined, undefined], resources: object, schema: undefined }, "Abruzzo", "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object: any = [{ type: undefined }]
        let callFunction: any = () => {
            findInputFieldForType({ types: [undefined, undefined, undefined], queries: [undefined, undefined, undefined, undefined, undefined], resources: object, schema: undefined }, "Alabama", "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object: any = [{ type: undefined, key0: -100, key1: false, key2: "This is a Text", key3: false }, { type: undefined, key0: 100, key1: "Foo bar", key2: "foo bar", key3: "This is a Text" }, { type: undefined, key0: 1, key1: 100, key2: true }]
        let callFunction: any = () => {
            findInputFieldForType({ types: [undefined, undefined, undefined, undefined, undefined], queries: [undefined, undefined, undefined, undefined], resources: object, schema: undefined }, "Alabama", "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object: any = [{ type: undefined, key0: true, key1: "Hello, world!", key2: true }, { type: undefined, key0: "This is a Text", key1: true, key2: 0 }]
        let callFunction: any = () => {
            findInputFieldForType({ types: [undefined], queries: [undefined, undefined, undefined, undefined], resources: object, schema: undefined }, "Alabama", "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object: any = [{ type: undefined, key0: 1, key1: true, key2: "foo bar", key3: false }, { type: undefined, key0: 1, key1: "Hello, world!", key2: "Hello, world!", key3: "foo bar" }, { type: undefined, key0: 0, key1: 1, key2: false }]
        let callFunction: any = () => {
            findInputFieldForType({ types: [undefined, undefined, undefined, undefined, undefined], queries: [undefined, undefined, undefined, undefined], resources: object, schema: undefined }, "Alabama", "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            findInputFieldForType({ types: [], queries: [], resources: [], schema: undefined }, "", "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("inputFieldExistsForType", () => {
    test("0", () => {
        let object: any = [{ type: undefined }, { type: undefined, key0: 1, key1: false, key2: true, key3: true }, { type: undefined }]
        let callFunction: any = () => {
            inputFieldExistsForType({ types: [undefined, undefined], queries: [undefined], resources: object, schema: undefined }, "Alabama", "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object: any = [{ type: undefined }, { type: undefined, key0: 1, key1: true, key2: false, key3: true }, { type: undefined }]
        let callFunction: any = () => {
            inputFieldExistsForType({ types: [undefined, undefined], queries: [undefined], resources: object, schema: undefined }, "Florida", "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object: any = [{ type: undefined, key0: "This is a Text", key1: 1, key2: true }, { type: undefined, key0: -5.48, key1: -100, key2: true }, { type: undefined, key0: 100, key1: false, key2: 100, key3: "Foo bar" }, { type: undefined, key0: true, key1: 1, key2: false }]
        let callFunction: any = () => {
            inputFieldExistsForType({ types: [undefined], queries: [undefined], resources: object, schema: undefined }, "Abruzzo", "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object: any = [{ type: undefined, key0: false, key1: "foo bar" }, { type: undefined, key0: "foo bar" }]
        let callFunction: any = () => {
            inputFieldExistsForType({ types: [undefined, undefined, undefined, undefined, undefined], queries: [undefined, undefined, undefined, undefined], resources: object, schema: undefined }, "Abruzzo", "The slim & simple Maple Gaming Keyboard from Dev Byte comes with a sleek body and 7- Color RGB LED Back-lighting for smart functionality")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object: any = [{ type: undefined, key0: "foo bar", key1: -100, key2: false }, { type: undefined, key0: 0, key1: -100, key2: false }, { type: undefined, key0: 100, key1: true, key2: -100, key3: "This is a Text" }, { type: undefined, key0: true, key1: 100, key2: true }]
        let callFunction: any = () => {
            inputFieldExistsForType({ types: [undefined], queries: [undefined], resources: object, schema: undefined }, "Alabama", "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inputFieldExistsForType({ types: [], queries: [], resources: [], schema: undefined }, "", "")
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("buildReferenceField", () => {
    test("0", () => {
        let object: any = [{ type: undefined, key0: -5.48, key1: "This is a Text", key2: false }, { type: undefined }, { type: undefined }, { type: undefined }]
        let callFunction: any = () => {
            buildReferenceField({ inputArg: { key0: -5.48, key1: 100 }, introspectionResults: { types: [undefined], queries: [undefined, undefined, undefined, undefined, undefined], resources: object, schema: undefined }, typeName: "Île-de-France", field: "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J", mutationType: "array" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object: any = [{ type: undefined, key0: false, key1: "This is a Text", key2: -100, key3: false }, { type: undefined, key0: true, key1: false, key2: -5.48, key3: -5.48, key4: true }, { type: undefined }]
        let callFunction: any = () => {
            buildReferenceField({ inputArg: { key0: 0, key1: true }, introspectionResults: { types: [undefined, undefined, undefined, undefined], queries: [undefined, undefined, undefined, undefined, undefined], resources: object, schema: undefined }, typeName: "Abruzzo", field: "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design", mutationType: "string" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object: any = [{ type: undefined }]
        let callFunction: any = () => {
            buildReferenceField({ inputArg: { key0: true, key1: "Hello, world!", key2: -100, key3: true, key4: 1 }, introspectionResults: { types: [undefined], queries: [undefined, undefined], resources: object, schema: undefined }, typeName: "Florida", field: "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design", mutationType: "object" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object: any = [{ type: undefined }]
        let callFunction: any = () => {
            buildReferenceField({ inputArg: { key0: false, key1: "Foo bar", key2: -5.48, key3: false, key4: -5.48 }, introspectionResults: { types: [undefined], queries: [undefined, undefined], resources: object, schema: undefined }, typeName: "Abruzzo", field: "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles", mutationType: "string" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object: any = [{ type: undefined, key0: 1, key1: "foo bar", key2: false }, { type: undefined }, { type: undefined }, { type: undefined }]
        let callFunction: any = () => {
            buildReferenceField({ inputArg: { key0: 1, key1: -5.48 }, introspectionResults: { types: [undefined], queries: [undefined, undefined, undefined, undefined, undefined], resources: object, schema: undefined }, typeName: "Île-de-France", field: "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J", mutationType: "array" })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            buildReferenceField({ inputArg: { key0: -Infinity, key1: false, key2: false }, introspectionResults: { types: [], queries: [], resources: [], schema: undefined }, typeName: "", field: "", mutationType: "" })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("buildUpdateVariables", () => {
    test("0", () => {
        let object: any = [{ type: undefined, key0: -100 }, { type: undefined, key0: "Foo bar", key1: "foo bar", key2: -100, key3: "This is a Text", key4: false }, { type: undefined, key0: -100, key1: false, key2: "Foo bar" }, { type: undefined, key0: 0, key1: -100, key2: "foo bar", key3: true, key4: true }]
        let callFunction: any = () => {
            buildUpdateVariables({ types: [undefined, undefined], queries: [undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object: any = [{ type: undefined, key0: -100 }, { type: undefined, key0: "Foo bar", key1: "Hello, world!", key2: false }, { type: undefined, key0: -5.48, key1: 100, key2: false, key3: "foo bar" }]
        let callFunction: any = () => {
            buildUpdateVariables({ types: [undefined], queries: [undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object: any = [{ type: undefined, key0: true }, { type: undefined, key0: 1 }]
        let callFunction: any = () => {
            buildUpdateVariables({ types: [undefined], queries: [undefined, undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object: any = [{ type: undefined, key0: -5.48 }, { type: undefined, key0: "Hello, world!", key1: "Foo bar", key2: true }, { type: undefined, key0: 100, key1: -100, key2: false, key3: "foo bar" }]
        let callFunction: any = () => {
            buildUpdateVariables({ types: [undefined], queries: [undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object: any = [{ type: undefined, key0: -5.48 }, { type: undefined, key0: "Foo bar", key1: "This is a Text", key2: -100, key3: "Foo bar", key4: true }, { type: undefined, key0: -5.48, key1: false, key2: "foo bar" }, { type: undefined, key0: 100, key1: -5.48, key2: "This is a Text", key3: true, key4: false }]
        let callFunction: any = () => {
            buildUpdateVariables({ types: [undefined, undefined], queries: [undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            buildUpdateVariables({ types: [], queries: [], resources: [], schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("buildCreateVariables", () => {
    test("0", () => {
        let object: any = [{ type: undefined, key0: "This is a Text", key1: "Foo bar", key2: 100, key3: "This is a Text" }, { type: undefined, key0: true, key1: true, key2: false }, { type: undefined }, { type: undefined, key0: true, key1: true, key2: true, key3: -5.48 }, { type: undefined, key0: true }]
        let callFunction: any = () => {
            buildCreateVariables({ types: [undefined, undefined], queries: [undefined, undefined, undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object: any = [{ type: undefined, key0: -100, key1: false, key2: "This is a Text", key3: 1 }, { type: undefined }, { type: undefined }, { type: undefined, key0: true, key1: true, key2: false, key3: -5.48, key4: 1 }, { type: undefined, key0: false, key1: true, key2: false, key3: true }]
        let callFunction: any = () => {
            buildCreateVariables({ types: [undefined, undefined, undefined, undefined], queries: [undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object: any = [{ type: undefined, key0: -100, key1: false, key2: "Hello, world!", key3: -100 }, { type: undefined }, { type: undefined }, { type: undefined, key0: false, key1: false, key2: true, key3: 100, key4: 1 }, { type: undefined, key0: false, key1: true, key2: false, key3: true }]
        let callFunction: any = () => {
            buildCreateVariables({ types: [undefined, undefined, undefined, undefined], queries: [undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object: any = [{ type: undefined, key0: "foo bar", key1: "Hello, world!", key2: 1, key3: "Foo bar" }, { type: undefined, key0: false, key1: false, key2: true }, { type: undefined }, { type: undefined, key0: true, key1: false, key2: false, key3: -100 }, { type: undefined, key0: false }]
        let callFunction: any = () => {
            buildCreateVariables({ types: [undefined, undefined], queries: [undefined, undefined, undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object: any = [{ type: undefined, key0: 0 }, { type: undefined, key0: "Hello, world!" }, { type: undefined, key0: false, key1: true, key2: false, key3: false, key4: 0 }, { type: undefined, key0: false, key1: "This is a Text" }, { type: undefined, key0: -100, key1: false, key2: 100, key3: -5.48, key4: "Foo bar" }]
        let callFunction: any = () => {
            buildCreateVariables({ types: [undefined, undefined, undefined, undefined, undefined], queries: [undefined, undefined, undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            buildCreateVariables({ types: [], queries: [], resources: [], schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("buildVariables.default", () => {
    test("0", () => {
        let object: any = [{ type: undefined, key0: "foo bar" }]
        let callFunction: any = () => {
            buildVariables.default({ types: [undefined, undefined, undefined], queries: [undefined, undefined, undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let object: any = [{ type: undefined, key0: 0, key1: -100, key2: -5.48, key3: -5.48 }, { type: undefined, key0: true, key1: 100, key2: "Hello, world!", key3: false }, { type: undefined, key0: 0, key1: "Hello, world!", key2: 0 }]
        let callFunction: any = () => {
            buildVariables.default({ types: [undefined, undefined, undefined], queries: [undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let object: any = [{ type: undefined, key0: "foo bar", key1: false, key2: 0, key3: false, key4: 1 }, { type: undefined, key0: "foo bar", key1: false, key2: "foo bar", key3: "Hello, world!" }, { type: undefined, key0: 0, key1: true, key2: false, key3: "Hello, world!" }, { type: undefined, key0: true, key1: 100, key2: -5.48, key3: true }, { type: undefined, key0: true, key1: false, key2: "This is a Text" }]
        let callFunction: any = () => {
            buildVariables.default({ types: [undefined, undefined, undefined, undefined, undefined], queries: [undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let object: any = [{ type: undefined, key0: 0, key1: -5.48, key2: 0, key3: 0 }, { type: undefined, key0: true, key1: -5.48, key2: "Foo bar", key3: true }, { type: undefined, key0: 0, key1: "foo bar", key2: 100 }]
        let callFunction: any = () => {
            buildVariables.default({ types: [undefined, undefined, undefined], queries: [undefined, undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let object: any = [{ type: undefined, key0: "foo bar", key1: "Foo bar", key2: "Foo bar" }, { type: undefined, key0: "This is a Text", key1: 0, key2: "This is a Text" }, { type: undefined, key0: "Hello, world!", key1: true, key2: false, key3: -5.48, key4: 100 }, { type: undefined, key0: 0 }]
        let callFunction: any = () => {
            buildVariables.default({ types: [undefined, undefined, undefined, undefined, undefined], queries: [undefined, undefined], resources: object, schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            buildVariables.default({ types: [], queries: [], resources: [], schema: undefined })
        }
    
        expect(callFunction).not.toThrow()
    })
})
