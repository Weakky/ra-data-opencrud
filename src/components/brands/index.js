//TODO: Manage to edit a simple user ("index.js:2178 Warning: Missing translation for key: "params cannot be empty"")

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
  NumberField,
  BooleanField, SelectInput, SimpleShowLayout
} from "react-admin";
import React from 'react'

export const BrandFilter = props => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name_contains" alwaysOn />
    <ReferenceInput label="Shop" source="shop.id" reference="Shop" alwaysOn>
      <SelectInput optionText="name"/>
    </ReferenceInput>
  </Filter>
)

export const BrandList = props => (
  <List filters={<BrandFilter />} {...props}>
    <Datagrid>
      <TextField source="id"/>
      <TextField source="name"/>
      <ReferenceField source="category.id" reference="Category">
        <TextField source="name"/>
      </ReferenceField>
      <ReferenceField source="shop.id" reference="Shop">
        <TextField source="name"/>
      </ReferenceField>
      <EditButton/>
      <ShowButton/>
    </Datagrid>
  </List>
);

export const BrandEdit = props => (
  <Edit title="Edit a brand" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <ReferenceInput source="category.id" reference="Category">
        <SelectInput optionText="name"/>
      </ReferenceInput>
      <ReferenceInput source="shop.id" reference="Shop">
        <SelectInput optionText="name"/>
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const BrandShow = props => (
  <Show title="Show a brand" {...props}>
    <SimpleShowLayout>
      <TextField source="id"/>
      <TextField source="name"/>
      <ReferenceField source="category.id" reference="Category">
        <TextField source="name"/>
      </ReferenceField>
      <ReferenceField source="shop.id" reference="Shop">
        <TextField source="name"/>
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);

export const BrandCreate = props => (
  <Create title="Create a brand" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <ReferenceInput source="category.id" reference="Category">
        <SelectInput optionText="name"/>
      </ReferenceInput>
      <ReferenceInput source="shop.id" reference="Shop">
        <SelectInput optionText="name"/>
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
