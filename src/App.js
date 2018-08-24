import React, { Component } from 'react';
import './App.css';

import {
  Admin,
  Resource,
  Delete,
  List,
  Datagrid,
  TextField,
  ReferenceField,
  ReferenceManyField,
  EditButton,
  ShowButton,
  Edit,
  DisabledInput,
  TextInput,
  SimpleForm,
  SingleFieldList,
  ChipField
} from 'react-admin';
import buildPrismaProvider from './adaptator';

import { ProductEdit, ProductList } from './components/products';
import { ShopEdit, ShopList } from './components/shops';
import { OrderList } from './components/orders';
import { VariantList } from './components/variants';
import { CategoryCreate, CategoryEdit, CategoryList, CategoryShow } from './components/categories';
import { BrandCreate, BrandEdit, BrandList, BrandShow } from './components/brands';
import {
  AttributeCreate,
  AttributeEdit,
  AttributeList,
  AttributeShow
} from './components/attributes';
import { OptionCreate, OptionEdit, OptionList, OptionShow } from './components/options';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { dataProvider: null };
  }

  componentDidMount() {
    buildPrismaProvider({
      clientOptions: { uri: 'https://eu1.prisma.sh/flavian/ra-data-prisma/dev' }
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
