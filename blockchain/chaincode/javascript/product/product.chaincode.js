/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// Deterministic JSON.stringify()
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

function jsonStringify(obj) {
  return stringify(sortKeysRecursive(obj));
}

/**
 * product status rules
 * ORDER_CREATED - by TheCompany
 * IN_PROGRESS - by vendor
 * SUBMIT_FOR_REVIEW - by vendor
 * IN_VERIFICATION - by TheCompany
 * CHANGE_REQUEST or PROCESS_PAYMENT - by TheCompany
 * PAYMENT_RECEIVED - by vendor
 */

class Product extends Contract {
  async InitLedger(ctx) {
    const products = [
      {
        ID: "asset1",
        Name: "Example Product1",
        Status: "Order Created",
        Description: "Example product description",
      },
    ];

    for (const product of products) {
      await ctx.stub.putState(product.ID, Buffer.from(jsonStringify(product)));
    }

    console.log('Ledger initialized successfully');
  }

  // CreateProduct issues a new product to the world state with given details.
  // This can be called only by TheCompany
  async CreateProduct(ctx, id, name, status, description) {
    const exists = await this.ProductExists(ctx, id);
    if (exists) {
      throw new Error(`The product ${id} already exists`);
    }

    const product = {
      ID: id,
      Name: name,
      Status: status,
      Description: description,
    };
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(id, Buffer.from(jsonStringify(product)));
    return JSON.stringify(product);
  }

  // ReadProduct returns the product stored in the world state with given id.
  // This can be called by both TheCompany and Vendor
  async ReadProduct(ctx, id) {
    const productJSON = await ctx.stub.getState(id); // get the product from chaincode state
    if (!productJSON || productJSON.length === 0) {
      throw new Error(`The product ${id} does not exist`);
    }
    return productJSON.toString();
  }

  // UpdateProduct updates an existing product in the world state with provided parameters.
  // This can be called by both TheCompany and Vendor
  async UpdateProduct(ctx, id, name, status, description) {
    const exists = await this.ProductExists(ctx, id);
    if (!exists) {
      throw new Error(`The product ${id} does not exist`);
    }

    // overwriting original product with new product
    const updatedProduct = {
      ID: id,
      Name: name,
      Status: status,
      Description: description
    };
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    return ctx.stub.putState(id, Buffer.from(jsonStringify(updatedProduct)));
  }

  // DeleteProduct deletes an given product from the world state.
  // This can be called only by TheCompany admin
  async DeleteProduct(ctx, id) {
    const exists = await this.ProductExists(ctx, id);
    if (!exists) {
      throw new Error(`The product ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  // ProductExists returns true when product with given ID exists in world state.
  async ProductExists(ctx, id) {
    const productJSON = await ctx.stub.getState(id);
    return productJSON && productJSON.length > 0;
  }

  // GetAllProducts returns all products found in the world state.
  // This can be called by both TheCompany and vendor
  async GetAllProducts(ctx) {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all products in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = Product;
