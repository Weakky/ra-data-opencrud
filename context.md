# A little bit of context

1. [Context](#1.-context)
2. [React-admin ?](#2.-react-admin?)
3. [How (GraphQL) adaptators are working?](#3.-how-(graphql)-adaptators-are-working?)
4. [OpenCRUD you say ?](#4.-opencrud-you-say-?) 
5. [Challenges limitations with Prisma](#4.-challenges-and-limitations-with-prisma)


## 1. Context

As powerful as prisma can be, building backoffices can be painful mostly due to the redundancy of the tasks.

As Prisma architecture suggest, it should be put behind a handcrafted GraphQL server, and be used as a bridge between the database and the actual API that will eventually be consumed. This implies that most of the CRUD mutations will inevitably have to be **duplicated**.

On top of that, these duplicated resolvers will need additional logic to compute which fields needs to be disconnected, which needs to be connect, created, or updated, which kill all the benefits from having an auto-generated CRUD GraphQL API.

There may be one solution though: As Prisma builds **a generic GraphQL API following conventions**, it means there's a door for **automation**.
If we used Prisma *directly* to handle all those redundant CRUD tasks, and made use of the conventions followed by Prisma, maybe we could automate the whole process.

## 2. React-admin?

*A powerful library to build backoffices on top of any backend*

As the github package says, `react-admin` is "A frontend Framework for building admin applications running in the browser on top of REST/GraphQL APIs, using ES6, React and Material Design".

`react-admin` uses an adaptator approach, making it theoretically working with any kind of API that follows a predictable convention (which is the case of Prisma).

`react-admin` speaks a dialect that abstract most CRUD operations (`CREATE`, `UPDATE`, `GET_MANY`, `GET_ONE`, `GET_LIST` etc...). It is then the responsability of the adaptator to convert this dialect into requests that can be understood by our backend. Below is an example following *GraphCool's* grammar.

![](https://camo.githubusercontent.com/a58fc16d347122afd015c06a96591c5ecc1bed62/68747470733a2f2f696d6775722e636f6d2f4d6f496e665a4d2e706e67)


In fact, there's [already an adaptator](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphcool) working with *GraphCool's* conventions. The only remaining job is to update this adaptator to follow *Prisma*'s conventions.

## 3. How (GraphQL) adaptators are working?

Most GraphQL adaptators are based on [a low level adaptator called ra-data-graphql](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql) made by `react-admin` creators.

In a nutshell, its job is to run an introspection query on your GraphQL api, pass it to *your* adaptator along with the type of query that is made (`CREATE`, `UPDATE`, `GET_MANY`, `GET_ONE`, `GET_LIST`, `DELETE` etc...).

It is then the job of the *prisma adaptator* to build the GraphQL query that matches *Prisma's* conventions, and to provide a function that will parse the response of that query in a way that `react-admin` can understand.

Once the query and the function is passed back to `ra-data-graphql`, the actual HTTP requests is sent (using ApolloClient) to your GraphQL API, then the response is parsed with the provided function and that parsed response is given to `ra-core`, the core of react-admin. *That's it.*

`ra-core` => `ra-data-graphql` => `ra-data-opencrud` => `ra-data-graphql` => `ra-core`.

## 4. OpenCRUD you say ?

[OpenCRUD](https://github.com/opencrud/opencrud) is a GraphQL CRUD API specification for databases. It is the specification currently followed by Prisma, and GraphCMS. 

## 5. Challenges and limitations with Prisma

As querying data with Prisma is as straightforward as with any other GraphQL API, there won't be big challenges here.
When relevant, `react-admin` passes some parameters to the adaptator (pagination, sorting, and filtering). As Prisma already handles pagination, sorting and filtering, converting them to Prisma types should be easy.
`react-admin` also expects a `total` field when fetching several items to properly handle pagination. Prisma is also able to provide that data using `<Type>Connection` fields.

### Challenges will mostly be on the Create/Update part

But that's where all the redundancy explained above will be done once and for all.

Thanksfully, when *updating* a resource, `react-admin` not only provides to the adaptator the updated data, but also the **previous data**. This will allow to compute fields that will have to be **created** / **connected** / **disconnected** / **updated** / **deleted** (by processing a diff [like I've done here](https://github.com/Weakky/prisma-ecommerce/blob/master/prisma/src/resolvers/Mutation/option.ts#L9-L24) for example).

One drawback is that we will have to make **an opiniated choice** as how **updates** and **creations** treats references.

Here is my proposal regarding this default behavior:

`CREATE`: When creating a resource, references should only be **connected**.</br>
`UPDATE`: When updating a resource, references should only be **connected**/**disconnected**/**updated** using the computations shown on the link above.

### Quick explanation regarding the diff to compute nodes to connect/disconnect/update:

Given `data` (the updated data) and `previousData` (the data before the updates)

Nodes to `connect` are: Nodes ids that are in `data` but not in `previousData`</br>
Nodes to `disconnect` are: Nodes ids that are no longer in `data` but in `previousData`</br>
Nodes to `update` are: Nodes ids that are both present in `data` and `previousData`.</br>
Note: If the nodes to update haven't changed, we could still put them in an `update` object to let it be idem-potent.


### A way to override this behavior will be necessary.

##### (This part is still an ongoing discussion)

We might want for example to `create`/`delete` instead of `connect`/`disconnect`.
Here's a data-structure that could describe our needs, configurable by `resource` and by `fields` of that resource.

```js
// exported from prisma adaptator
// Prisma mutation types
export const CONNECT = 'connect';
export const DISCONNECT = 'disconnect';
export const CREATE = 'create';
export const DELETE = 'delete';
export const UPDATE = 'update';

// Mutation "actions"
export const NEW = 'new';
export const REMOVED = 'removed';
export const UPDATED = 'updated';

// What mutations options would look like according to the default behavior described above
const defaultMutationOptions = {  
  resourceName: {  
    field1: {  
      UPDATE: {  
        [NEW]: CONNECT,        //Connect the node when added 
	    [REMOVED]: DISCONNECT, //Disconnect the node when removed
	    [UPDATED]: UPDATE      //Update the node
      },  
	  CREATE: {  
        [NEW]: CONNECT
      }  
    },
    field2: { ... },
  },
  resourceName2: { ... }
};

buildPrismaDataProvider({
  clientOptions: { uri: 'localhost' },
  introspectionOptions: { ... },
  // overidden mutationOptions
  mutationOptions: {  
  Product: {  
    prices: {  
      UPDATE: {  
        [NEW]: CREATE,     //Create the node when added  
	    [REMOVED]: DELETE, //Delete the node when added
	    [UPDATED]: UPDATE  //Update the node  
      },  
	  CREATE: {  
        [NEW]: CONNECT  
      }  
    },  
  }  
}
});
```
