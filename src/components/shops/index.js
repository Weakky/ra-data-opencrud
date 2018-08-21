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
      <ReferenceManyField label="Options" target="shop.id" reference="Option">
        <Datagrid>
          <TextField source="name"/>
          <ReferenceManyField label="Option values" target="option.id" reference="OptionValue">
            <SingleFieldList>
              <ChipField source="name"/>
            </SingleFieldList>
          </ReferenceManyField>
        </Datagrid>
      </ReferenceManyField>
      <EditButton/>
      <ShowButton/>
    </Datagrid>
  </List>
);
