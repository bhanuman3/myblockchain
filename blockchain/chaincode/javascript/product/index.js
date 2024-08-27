/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Product = require('./product.chaincode');

module.exports.AssetTransfer = Product;
module.exports.contracts = [Product];
