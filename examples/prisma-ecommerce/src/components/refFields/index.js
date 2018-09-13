import React from 'react';
import get from 'lodash/get';
import {
  Link
} from 'react-admin';

/**
 * These components are necessary because we're not using <ReferenceField /> on <List /> components but <TextField /> instead.
 * Therefore, react-admin no longer generate hrefs for us, and we need to do it manually.
 *
 * <ReferenceField /> can be replaced by <TextField /> thanks to overriden queries in /queries folder.
 */

// Take a source, and replace the last field by 'id'
// eg: getIdPath('variant.product.name') => variant.product.id
const getIdPath = (source) => {
  const splitSource = source.split('.');

  if (splitSource.length === 1) {
    return splitSource;
  }

  splitSource[splitSource.length - 1] = 'id';

  return splitSource.join('.');
};

export const ProductLinkField = ({ source, record }) => (
  <Link to={`Product/${get(record, getIdPath(source))}`}>{get(record, source)}</Link>
);

export const BrandLinkField = ({ source, record }) => (
  <Link to={`Brand/${get(record, getIdPath(source))}`}>{get(record, source)}</Link>
);

export const ShopLinkField = ({ source, record }) => (
  <Link to={`Shop/${get(record, getIdPath(source))}`}>{get(record, source)}</Link>
);

export const CategoryLinkField = ({ source, record }) => (
  <Link to={`Category/${get(record, getIdPath(source))}`}>{get(record, source)}</Link>
);
