import React, {Component} from 'react';
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
  ChipField,
} from 'react-admin';
import buildGraphcoolProvider from './adaptator'

import introspectionOptions from './introspection/instropectionOptions';
import {ProductEdit, ProductList} from './components/products'
import {ShopList} from './components/shops'
import {OrderList} from './components/orders'
import {VariantList} from './components/variants'
import {CategoryCreate, CategoryEdit, CategoryList, CategoryShow} from './components/categories'
import {BrandCreate, BrandEdit, BrandList, BrandShow} from './components/brands'
import {AttributeCreate, AttributeEdit, AttributeList, AttributeShow} from './components/attributes'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {dataProvider: null};
  }

  componentDidMount() {

    buildGraphcoolProvider({
      clientOptions: { uri: 'http://localhost:4466/aromaclop/dev1' },
      introspection: introspectionOptions
    })
      .then(dataProvider => this.setState({ dataProvider }));
  }

  render() {
    const {dataProvider} = this.state;

    if (!dataProvider) {
      return <div>Loading</div>;
    }

    return (
      <Admin dataProvider={dataProvider}>
        <Resource name="Product" list={ProductList} edit={ProductEdit} />
        <Resource name="Order" list={OrderList} />
        <Resource name="Brand" list={BrandList} edit={BrandEdit} show={BrandShow} create={BrandCreate}/>
        <Resource name="Attribute" list={AttributeList} edit={AttributeEdit} show={AttributeShow} create={AttributeCreate}/>
        <Resource name="Category" list={CategoryList} edit={CategoryEdit} show={CategoryShow} create={CategoryCreate}/>
        <Resource name="Shop" list={ShopList} />
        <Resource name="Option" />
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
