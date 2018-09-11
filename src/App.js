import React, { Component } from 'react';
import { Admin, Resource, GET_LIST } from 'react-admin';
import get from 'lodash/get';

import buildPrismaProvider, { buildQuery } from './adaptator';
import overridenQueries from './queries';

import { ProductEdit, ProductList } from './components/products';
import { ShopEdit, ShopList } from './components/shops';
import { OrderList } from './components/orders';
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from './components/categories';
import { BrandCreate, BrandEdit, BrandList, BrandShow } from './components/brands';
import {
  AttributeCreate,
  AttributeEdit,
  AttributeList,
  AttributeShow
} from './components/attributes';
import { OptionCreate, OptionEdit, OptionList, OptionShow } from './components/options';

import './App.css';

const enhanceBuildQuery = (buildQuery) => (introspectionResults) => (fetchType, resourceName, params) => {
  const fragment = get(overridenQueries, `${resourceName}.${fetchType}`);

  return buildQuery(introspectionResults)(fetchType, resourceName, params, fragment);
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { dataProvider: null };
  }

  componentDidMount() {
    buildPrismaProvider({
      clientOptions: { uri: 'https://eu1.prisma.sh/flavian/ra-data-prisma/dev' },
      buildQuery: enhanceBuildQuery(buildQuery)
    }).then(dataProvider => this.setState({ dataProvider }));
  }

  render() {
    const { dataProvider } = this.state;

    if (!dataProvider) {
      return <div>Loading</div>;
    }

    return (
      <Admin title="Prisma e-commerce" dataProvider={dataProvider}>
        <Resource name="Product" list={ProductList} edit={ProductEdit} />
        <Resource name="Order" list={OrderList} />
        <Resource
          name="Brand"
          list={BrandList}
          edit={BrandEdit}
          show={BrandShow}
          create={BrandCreate}
        />
        <Resource
          name="Attribute"
          list={AttributeList}
          edit={AttributeEdit}
          show={AttributeShow}
          create={AttributeCreate}
        />
        <Resource
          name="Category"
          list={CategoryList}
          edit={CategoryEdit}
          show={CategoryShow}
          create={CategoryCreate}
        />
        <Resource name="Shop" list={ShopList} edit={ShopEdit} />
        <Resource
          name="Option"
          list={OptionList}
          edit={OptionEdit}
          show={OptionShow}
          create={OptionCreate}
        />
        <Resource name="OptionValue" />
        <Resource name="SelectedOption" />
        <Resource name="Variant" />
        <Resource name="User" />
        <Resource name="OrderLineItem" />
      </Admin>
    );
  }
}

export default App;
