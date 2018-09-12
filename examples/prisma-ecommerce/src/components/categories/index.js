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
  BooleanField,
  SelectInput,
  SimpleShowLayout
} from 'react-admin';
import React from 'react';

export const CategoryFilter = props => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name_contains" alwaysOn />
    <ReferenceInput label="Shop" source="shop.id" reference="Shop" alwaysOn>
      <SelectInput optionText="name"/>
    </ReferenceInput>
  </Filter>
);

export const CategoryList = props => (
  <List filters={<CategoryFilter />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField label="Shop" source="shop.name" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const CategoryEdit = props => (
  <Edit title="Edit a category" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);

export const CategoryShow = props => (
  <Show title="Show a category" {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <ReferenceField source="shop.id" reference="Shop">
        <TextField source="name" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);

export const CategoryCreate = props => (
  <Create title="Create a category" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <ReferenceInput source="shop.id" reference="Shop">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
