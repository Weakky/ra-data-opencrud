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
  BooleanField
} from "react-admin";
import React from "react";

export const OrderList = props => (
  <List {...props}>
    <Datagrid>
      <ReferenceField label="Buyer" source="owner.id" reference="User">
        <TextField source="firstName" />
      </ReferenceField>

      <ReferenceManyField label="Products" target="order.id" reference="OrderLineItem">
        <Datagrid>

          <ReferenceField label="Name" source="variant.id" reference="Variant">
            <ReferenceField source="product.id" reference="Product">
              <TextField source="name" />
            </ReferenceField>
          </ReferenceField>

          <ReferenceField label="Price" source="variant.id" reference="Variant">
            <NumberField
              source="price"
              options={{ style: "currency", currency: "EUR" }}
            />
          </ReferenceField>

          <ReferenceField label="Variants" source="variant.id" reference="Variant">
            <ReferenceManyField target="variant.id" reference="SelectedOption">
              <SingleFieldList>
                <ReferenceField source="value.id" reference="OptionValue">
                  <ChipField source="name"/>
                </ReferenceField>
              </SingleFieldList>
            </ReferenceManyField>
          </ReferenceField>

          <ReferenceField label="Available" source="variant.id" reference="Variant">
            <BooleanField source="available"/>
          </ReferenceField>

          <TextField source="quantity" />
        </Datagrid>
      </ReferenceManyField>
      <NumberField
        source="totalPrice"
        options={{ style: "currency", currency: "EUR" }}
      />
      <EditButton />
      <ShowButton />
    </Datagrid>
  </List>
);

export const CommentEdit = props => (
  <Edit title="Edit a comment" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="content" />
    </SimpleForm>
  </Edit>
);

export const CommentShow = props => (
  <Edit title="Show a user" {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="content" />
    </SimpleForm>
  </Edit>
);
