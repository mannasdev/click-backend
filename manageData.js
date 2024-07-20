import DiamSdk from "diamante-sdk-js";

var sourceKeys = DiamSdk.Keypair.fromSecret(
    "SASOAZNU3WDAYCYLGHV2B744XCZ2YHKHBMRFPU5JXY7G5Z56NIDTYPDS"
);

var server = new DiamSdk.Horizon.Server("https://diamtestnet.diamcircle.io");

var transaction;

server
  .loadAccount(sourceKeys.publicKey())
  .then(function (sourceAccount) {
    // Start building the transaction.
    transaction = new DiamSdk.TransactionBuilder(sourceAccount, {
      fee: DiamSdk.BASE_FEE,
      networkPassphrase: "Diamante Testnet",
    })
      .addOperation(
        DiamSdk.Operation.manageData({
          name: "Hello", // The name of the data entry
          value: "crazy crazy", // The value to store
        })
      )
      .setTimeout(0)
      .build();
    // Sign the transaction to prove you are actually the person sending it.
    transaction.sign(sourceKeys);
    // And finally, send it off to Diamante!
    return server.submitTransaction(transaction);
  })
  .then(function (result) {
    console.log("Success! Results:", result);
  })
  .catch(function (error) {
    console.error("Something went wrong!", error);
  });