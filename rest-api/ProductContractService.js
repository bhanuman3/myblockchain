const utf8Decoder = new TextDecoder();

class ProductContractService {
  constructor(contract) {
    this.contract = contract;
  }

  /**
   * This type of transaction would typically only be run once by an application the first time it was started after its
   * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
   */
  async initLedger() {
    console.log(
      "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
    );

    await this.contract.submitTransaction("InitLedger");

    console.log("*** Transaction committed successfully");
  }

  /**
   * Evaluate a transaction to query ledger state.
   */
  async getAllProducts() {
    console.log(
      "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
    );

    const resultBytes = await this.contract.evaluateTransaction(
      "GetAllProducts"
    );

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log("*** Result:", result);
    return result;
  }

  /**
   * Submit a transaction synchronously, blocking until it has been committed to the ledger.
   */
  async createProduct(obj) {
    console.log(
      "\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments"
    );

    await this.contract.submitTransaction(
      "CreateProduct",
      obj.ID,
      obj.Name,
      obj.Status,
      obj.Description
    );

    console.log("*** Transaction committed successfully");
    return obj;
  }

  async readProduct(assetId) {
    console.log(
      "\n--> Evaluate Transaction: ReadAsset, function returns asset attributes"
    );

    const resultBytes = await this.contract.evaluateTransaction(
      "ReadProduct",
      assetId
    );

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log("*** Result:", result);
    return result;
  }

  /**
   * submitTransaction() will throw an error containing details of any error responses from the smart contract.
   */
  async udpateProduct(obj) {
    console.log(
      "\n--> Submit Transaction: Update product"
    );

    try {
      await this.contract.submitTransaction(
        "UpdateProduct",
        obj.ID,
        obj.Name,
        obj.Status,
        obj.Description,
      );
      console.log("******** FAILED to return an error");
      return obj;
    } catch (error) {
      console.log("*** Successfully caught the error: \n", error);
      throw error
    }
  }
}

module.exports = ProductContractService;
