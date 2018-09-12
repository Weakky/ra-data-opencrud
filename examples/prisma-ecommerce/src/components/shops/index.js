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
  SelectArrayInput
} from "react-admin";
import React from 'react'

export const ShopFilter = props => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name_contains" alwaysOn />
  </Filter>
)

export const ShopList = props => (
  <List filters={<ShopFilter />} {...props}>
    <Datagrid>
      <TextField source="id"/>
      <TextField source="name"/>
      <EditButton/>
      <ShowButton/>
    </Datagrid>
  </List>
);

export const ShopEdit = props => (
  <Edit title="Edit a shop" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);
