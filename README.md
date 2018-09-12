# ra-data-opencrud

*Prisma on steroids*: easily build backoffices with Prisma/GraphCMS plugged on `react-admin`!

### Work in progress
If you wanna give it a try anyway, here's a quick preview on codesandbox.
The API is hosted on Prisma's public servers, which means the API is limited to 10 API calls per seconds.
Be aware that it might not be working because of that, or that performances may be poor.

[![Edit ra-data-prisma](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/Weakky/ra-data-prisma/tree/master/examples/prisma-ecommerce)

# Summary

- [What is react admin ? And what's that ?](#what-is-react-admin-?-and-what's-ra-data-opencrud-?)
- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)
- [Tips and workflow](#tips-and-workflow)
- [Contributing](#contributing)

## What is react admin ? And what's ra-data-opencrud ?

[Find out more about the benefits of using `react-admin` with Prisma here.](context.md) 

## Installation

Install with:

```sh
npm install --save graphql ra-data-opencrud
```

or

```sh
yarn add graphql ra-data-opencrud
```

## Usage

This example assumes a `Post` type is defined in your datamodel.

```js
// in App.js
import React, { Component } from 'react';
import buildOpenCrudProvider from 'ra-data-opencrud';
import { Admin, Resource, Delete } from 'react-admin';

import { PostCreate, PostEdit, PostList } from './posts';

const client = new ApolloClient();

class App extends Component {
    constructor() {
        super();
        this.state = { dataProvider: null };
    }
    componentDidMount() {
        buildOpenCrudProvider({ clientOptions: { uri: 'your_prisma_or_graphcms_endpoint' }})
            .then(dataProvider => this.setState({ dataProvider }));
    }

    render() {
        const { dataProvider } = this.state;

        if (!dataProvider) {
            return <div>Loading</div>;
        }

        return (
            <Admin dataProvider={dataProvider}>
                <Resource name="Post" list={PostList} edit={PostEdit} create={PostCreate} remove={Delete} />
            </Admin>
        );
    }
}

export default App;
```

And that's it, `buildOpenCrudProvider` will create a default ApolloClient for you and run an [introspection](http://graphql.org/learn/introspection/) query on your Prisma/GraphCMS endpoint, listing all potential resources.

## Options

### Customize the Apollo client

You can either supply the client options by calling `buildOpenCrudProvider` like this:

```js
buildOpenCrudProvider({ clientOptions: { uri: 'your_prisma_or_graphcms_endpoint', ...otherApolloOptions } });
```

Or supply your client directly with:

```js
buildOpenCrudProvider({ client: myClient });
```

### Overriding a specific query

The default behavior might not be optimized especially when dealing with references. You can override a specific query by decorating the `buildQuery` function:

#### With a whole query

```js
// in src/dataProvider.js
import buildOpenCrudProvider, { buildQuery } from 'ra-data-opencrud';

const enhanceBuildQuery = introspection => (fetchType, resource, params) => {
    const builtQuery = buildQuery(introspection)(fetchType, resource, params);

    if (resource === 'Command' && fetchType === 'GET_ONE') {
        return {
            // Use the default query variables and parseResponse
            ...builtQuery,
            // Override the query
            query: gql`
                query Command($id: ID!) {
                    data: Command(id: $id) {
                        id
                        reference
                        customer {
                            id
                            firstName
                            lastName
                        }
                    }
                }`,
        };
    }

    return builtQuery;
}

export default buildOpenCrudProvider({ buildQuery: enhanceBuildQuery })
```

#### Or using fragments

You can also override a query using the same API `graphql-binding` offers.

`buildQuery` accept a fourth parameter which is a fragment that will be used as the final query.

```js
// in src/dataProvider.js
import buildOpenCrudProvider, { buildQuery } from 'ra-data-opencrud';

const enhanceBuildQuery = introspection => (fetchType, resource, params) => {
    if (resource === 'Command' && fetchType === 'GET_ONE') {
        // If you need auto-completion from your IDE, you can also use gql and provide a valid fragment
        return buildQuery(introspection)(fetchType, resource, params, `{
            id
            reference
            customer { id firstName lastName }
        }`);
    }

    return buildQuery(introspection)(fetchType, resource, params);
}

export default buildOpenCrudProvider({ buildQuery: enhanceBuildQuery })
```

As this approach can become really cumbersome, you can find a more elegant way to pass fragments in the example under `/examples/prisma-ecommerce` 

### Customize the introspection

These are the default options for introspection:

```js
const introspectionOptions = {
    include: [], // Either an array of types to include or a function which will be called for every type discovered through introspection
    exclude: [], // Either an array of types to exclude or a function which will be called for every type discovered through introspection
}

// Including types
const introspectionOptions = {
    include: ['Post', 'Comment'],
};

// Excluding types
const introspectionOptions = {
    exclude: ['CommandItem'],
};

// Including types with a function
const introspectionOptions = {
    include: type => ['Post', 'Comment'].includes(type.name),
};

// Including types with a function
const introspectionOptions = {
    exclude: type => !['Post', 'Comment'].includes(type.name),
};
```

**Note**: `exclude` and `include` are mutualy exclusives and `include` will take precendance.

**Note**: When using functions, the `type` argument will be a type returned by the introspection query. Refer to the [introspection](http://graphql.org/learn/introspection/) documentation for more information.

Pass the introspection options to the `buildApolloProvider` function:

```js
buildApolloProvider({ introspection: introspectionOptions });
```

## Tips and workflow

### Performance issues
As react-admin was originally made for REST endpoints, it cannot always take full advantage of GraphQL's benefits.

Although `react-admin` already has a load of bult-in optimizations ([Read more here](marmelab.com/blog/2016/10/18/using-redux-saga-to-deduplicate-and-group-actions.html) and [here](https://github.com/marmelab/react-admin/issues/2243)),
it is not yet well suited when fetching n-to-many relations (multiple requests will be sent).

To counter that limitation, as shown above, you can override queries to directly provide all the fields that you will need to display your view.

#### Suggested workflow

As overriding all queries can be cumbersome, **this should be done progressively**.

- Start by using `react-admin` the way you're supposed to (using `<ReferenceField />` and `<ReferenceManyField />` when trying to access references)
- Detect the hot-spots
- Override the queries on those hot-spots by providing all the fields necessary (as [shown above](#or-using-fragments))
- Replace the `<ReferenceField />` by simple fields (such as `<TextField />`) by accessing the resource in the following way: `<TextField source="product.name" />`
- Replace the `<ReferenceManyField />` by `<ArrayField />` using the same technique as above

## Contributing

Use the example under `examples/prisma-ecommerce` as a playground for improving `ra-data-opencrud`.

To easily enhance `ra-data-opencrud` and get the changes reflected on `examples/prisma-ecommerce`, do the following:

- `cd ra-data-opencrud`
- `yarn link`
- `cd examples/prisma-ecommerce`
- `yarn link ra-data-opencrud`

Once this is done, the `ra-data-opencrud` dependency will be replaced by the one on the repository.
**One last thing, don't forget to transpile the library with babel by running the following command on the root folder**


```sh
yarn watch
```

You should now be good to go ! Run the tests with this command:

```sh
jest
```
