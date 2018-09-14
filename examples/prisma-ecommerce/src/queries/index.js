import { GET_LIST } from 'react-admin';
import gql from 'graphql-tag';

export default {
  Product: {
    [GET_LIST]: gql`
      fragment product on Product {
        id
        name
        description
        brand {
          id
          name
        }
        category {
          id
          name
        }
        shop {
          id
          name
        }
        attributes {
          id
          value
        }
      }
    `
  },
  Order: {
    [GET_LIST]: gql`
      fragment order on Order {
        id
        totalPrice
        owner {
          id
          firstName
        }
        lineItems {
          id
          quantity
          variant {
            id
            available
            price
            product {
              id
              name
            }
            selectedOptions {
              id
              value {
                name
              }
            }
          }
        }
      }
    `
  },
  Brand: {
    [GET_LIST]: gql`
      fragment brand on Brand {
        id
        name
        category {
          id
          name
        }
        shop {
          id
          name
        }
      }
    `
  },
  Category: {
    [GET_LIST]: gql`
      fragment category on Category {
        id
        name
        shop {
          id
          name
        }
      }
    `
  },
  Attribute: {
    [GET_LIST]: gql`
      fragment attribute on Attribute {
        id
        value
        category {
          id
          name
        }
        shop {
          id
          name
        }
      }
    `
  },
  Option: {
    [GET_LIST]: gql`
      fragment option on Option {
        id
        name
        values {
          name
        }
        shop {
          id
          name
        }
      }
    `
  }
};
