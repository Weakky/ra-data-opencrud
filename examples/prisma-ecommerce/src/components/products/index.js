import React from 'react';
import {
  Edit,
  List,
  Show,
  Create,
  ChipField,
  Datagrid,
  DisabledInput,
  EditButton,
  ReferenceManyField,
  ReferenceField,
  ShowButton,
  SimpleForm,
  SingleFieldList,
  TextField,
  TextInput,
  Filter,
  ReferenceInput,
  ReferenceArrayInput,
  SelectArrayInput,
  SelectInput,
  ArrayField,
} from 'react-admin';
import { BrandLinkField, CategoryLinkField, ShopLinkField } from '../refFields';

export const ProductFilter = props => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name_contains" alwaysOn />
    <ReferenceInput label="Shop" source="shop.id" reference="Shop" alwaysOn>
      <SelectInput optionText="name" />
    </ReferenceInput>
    <ReferenceArrayInput label="Brands" source="brand" reference="Brand">
      <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>
    <ReferenceArrayInput
      label="Attributes"
      source="attributes_some"
      reference="Attribute"
    >
      <SelectArrayInput optionText="value" />
    </ReferenceArrayInput>
    <ReferenceArrayInput
      label="Options"
      source="options_some"
      reference="Option"
    >
      <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>
  </Filter>
);

export const ProductList = props => (
  <List filters={<ProductFilter />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <BrandLinkField label="Brand" source="brand.name" />
      <ArrayField label="Attributes" source="attributes">
        <SingleFieldList linkType={false}>
          <ChipField source="value" />
        </SingleFieldList>
      </ArrayField>
      <CategoryLinkField label="Category" source="category.name" />
      <ShopLinkField label="Shop" source="shop.name" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const ProductEdit = props => (
  <Edit title="Edit a product" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <TextInput source="description" />
      <ReferenceInput source="category.id" reference="Category">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="brand.id" reference="Brand">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceArrayInput
        label="Attributes"
        source="attributesIds"
        reference="Attribute"
      >
        <SelectArrayInput optionText="value" />
      </ReferenceArrayInput>
      <ReferenceArrayInput
        label="Options"
        source="optionsIds"
        reference="Option"
      >
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);

export const ProductCreate = props => (
  <Create title="Create a product" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
