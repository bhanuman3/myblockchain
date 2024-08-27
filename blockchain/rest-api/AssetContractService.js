
const utf8Decoder = new TextDecoder();
const assetId = `asset${String(Date.now())}`;

class AssetContractService {

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
  async getAllAssets() {
    console.log(
      "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
    );

    const resultBytes = await this.contract.evaluateTransaction("GetAllAssets");

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log("*** Result:", result);
    return result;
  }

  /**
   * Submit a transaction synchronously, blocking until it has been committed to the ledger.
   */
  async createAsset() {
    console.log(
      "\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments"
    );

    await contract.submitTransaction(
      "CreateAsset",
      assetId,
      "yellow",
      "5",
      "Tom",
      "1300"
    );

    console.log("*** Transaction committed successfully");
  }

  /**
   * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
   * while waiting for the commit notification.
   */
  async transferAssetAsync() {
    console.log(
      "\n--> Async Submit Transaction: TransferAsset, updates existing asset owner"
    );

    const assetId = 'asset2';

    const commit = await this.contract.submitAsync("TransferAsset", {
      arguments: [assetId, "Saptha"],
    });
    const oldOwner = utf8Decoder.decode(commit.getResult());

    console.log(
      `*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`
    );
    console.log("*** Waiting for transaction commit");

    const status = await commit.getStatus();
    if (!status.successful) {
      throw new Error(
        `Transaction ${
          status.transactionId
        } failed to commit with status code ${String(status.code)}`
      );
    }

    console.log("*** Transaction committed successfully");
  }

  async readAssetByID(assetId) {
    console.log(
      "\n--> Evaluate Transaction: ReadAsset, function returns asset attributes"
    );

    const resultBytes = await this.contract.evaluateTransaction(
      "ReadAsset",
      assetId
    );

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log("*** Result:", result);
    return result;
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
  async updateNonExistentAsset() {
    console.log(
      "\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error"
    );

    try {
      await this.contract.submitTransaction(
        "UpdateAsset",
        "asset70",
        "blue",
        "5",
        "Tomoko",
        "300"
      );
      console.log("******** FAILED to return an error");
    } catch (error) {
      console.log("*** Successfully caught the error: \n", error);
    }
  }
}

module.exports = AssetContractService;