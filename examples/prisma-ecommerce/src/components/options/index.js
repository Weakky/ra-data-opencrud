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
  SimpleShowLayout,
  ArrayField
} from 'react-admin';
import React from 'react';

export const OptionFilter = props => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name_contains" alwaysOn />
    <ReferenceInput label="Shop" source="shop.id" reference="Shop" alwaysOn>
      <SelectInput optionText="name"/>
    </ReferenceInput>
  </Filter>
);

export const OptionList = props => (
  <List filters={<OptionFilter />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <ArrayField label="Values" source="values">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <TextField label="Shop" source="shop.name" />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const OptionEdit = props => (
  <Edit title="Edit an option" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <ReferenceArrayInput label="Values" source="valuesIds" reference="OptionValue" perPage={200}>
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);

export const OptionShow = props => (
  <Show title="Show an option" {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <ReferenceField source="shop.id" reference="Shop">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceManyField label="Values" target="option.id" reference="OptionValue">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export const OptionCreate = props => (
  <Create title="Create an option" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" />
      <ReferenceInput source="category.id" reference="Category">
        <SelectInput optionText="name"/>
      </ReferenceInput>
      <ReferenceArrayInput label="Values" source="valuesIds" reference="OptionValue" perPage={200}>
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
      <ReferenceInput source="shop.id" reference="Shop">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
