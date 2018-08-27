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
  BooleanField
} from "react-admin";
import React from 'react'

export const VariantFilter = props => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name_contains" alwaysOn />
  </Filter>
)

export const VariantList = props => (
  <List filters={<VariantFilter />} {...props}>
    <Datagrid>
      <TextField source="id"/>
      <NumberField source="price"/>
      <BooleanField source="available"/>
      <EditButton/>
      <ShowButton/>
    </Datagrid>
  </List>
);

export const VariantEdit = props => (
  <Edit title="Edit a product" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <ReferenceManyField label="Options" target="author.id" reference="Comment">
        <SingleFieldList>
          <ChipField source="content" />
        </SingleFieldList>
      </ReferenceManyField>
    </SimpleForm>
  </Edit>
);

export const VariantShow = props => (
  <Show title="Show a product" {...props}>
    <DisabledInput source="id" />
    <TextInput source="name" />
    <ReferenceManyField label="Options" target="author.id" reference="Comment">
      <SingleFieldList>
        <ChipField source="content" />
      </SingleFieldList>
    </ReferenceManyField>
  </Show>
);

export const VariantCreate = props => (
  <Create title="Create a product" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
