import {
  ChipField,
  Datagrid,
  EditButton,
  List,
  Show,
  Edit,
  ReferenceManyField,
  ShowButton,
  SingleFieldList,
  TextField,
  ReferenceField,
  SimpleForm,
  DisabledInput,
  TextInput,
  NumberField,
  FunctionField,
  BooleanField, Filter, ReferenceInput, SelectInput,
  ArrayField
} from 'react-admin';
import React from "react";
import { ProductLinkField } from '../refFields';

export const OrderFilter = props => (
  <Filter {...props}>
    <ReferenceInput label="Shop" source="receiver.id" reference="Shop" alwaysOn>
      <SelectInput optionText="name"/>
    </ReferenceInput>
  </Filter>
);

export const OrderList = props => (
  <List filters={<OrderFilter />} {...props}>
    <Datagrid>
      <TextField label="Buyer" source="owner.firstName" />

      <ArrayField label="Products" source="lineItems">
        <Datagrid>

          <ProductLinkField label="Product" source="variant.product.name" />

          <NumberField
            label="Price"
            source="variant.price"
            options={{ style: "currency", currency: "EUR" }}
          />

          <ArrayField label="Values" source="variant.selectedOptions">
            <SingleFieldList>
              <ChipField source="value.name"/>
            </SingleFieldList>
          </ArrayField>

          <BooleanField label="Available" source="variant.available"/>

          <TextField label="Quantity" source="quantity" />
        </Datagrid>
      </ArrayField>
      <NumberField
        source="totalPrice"
        options={{ style: "currency", currency: "EUR" }}
      />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);
