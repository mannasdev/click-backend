import DiamSdk from "diamante-sdk-js";

var sourceKeys = DiamSdk.Keypair.fromSecret(
    "SASOAZNU3WDAYCYLGHV2B744XCZ2YHKHBMRFPU5JXY7G5Z56NIDTYPDS"
);

var server = new DiamSdk.Horizon.Server("https://diamtestnet.diamcircle.io");

server
  .loadAccount(sourceKeys.publicKey())
  .then(function (account) {
    console.log("Account exists:", account);
    // const data = atob(account.data_attr);
    // console.log(data);
    console.log(account.data_attr);
  })
  .catch(function (error) {
    console.error("Account not found!", error);
  });