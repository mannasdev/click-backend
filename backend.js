import { PrismaClient } from "@prisma/client";
import express from "express";
import DiamSdk from "diamante-sdk-js";

const app = express();
var server = new DiamSdk.Horizon.Server("https://diamtestnet.diamcircle.io/");

const prisma = new PrismaClient();
app.use(express.json());

// create object
app.post("/createObject", (req, res) => {
  const { name, amount, description, imageUrl } = req.body;
  try {
    var issuingKeys = DiamSdk.Keypair.fromSecret(
      "SB3B26F3IGQF3VHZA5RI25YOGIDMKBWEWJTKCEU4G4QOL7FRJPGJDN6R"
    );
    var receivingKeys = DiamSdk.Keypair.fromSecret(
      "SASOAZNU3WDAYCYLGHV2B744XCZ2YHKHBMRFPU5JXY7G5Z56NIDTYPDS"
    );

    var assetName = new DiamSdk.Asset(name, issuingKeys.publicKey());

    server
      .loadAccount(receivingKeys.publicKey())
      .then(function (receiver) {
        var transaction = new DiamSdk.TransactionBuilder(receiver, {
          fee: 100,
          networkPassphrase: DiamSdk.Networks.TESTNET,
        })
          // The `changeTrust` operation creates (or alters) a trustline
          // The `limit` parameter below is optional
          .addOperation(
            DiamSdk.Operation.changeTrust({
                opAttributes: description,
              asset: assetName,
            //   limit: "1000",
            })
          )
          // setTimeout is required for a transaction
          .setTimeout(100)
          .build();
        transaction.sign(receivingKeys);
        return server.submitTransaction(transaction);
      })
      .then(console.log)

      // Second, the issuing account actually sends a payment using the asset
      .then(function () {
        return server.loadAccount(issuingKeys.publicKey());
      })
      .then(function (issuer) {
        var transaction = new DiamSdk.TransactionBuilder(issuer, {
          fee: 100,
          networkPassphrase: DiamSdk.Networks.TESTNET,
        })
          .addOperation(
            DiamSdk.Operation.payment({
                description,
              destination: receivingKeys.publicKey(),
              asset: assetName,
              amount: amount,
            })
          )
          // setTimeout is required for a transaction
          .setTimeout(100)
          .build();
        transaction.sign(issuingKeys);
        return server.submitTransaction(transaction);
      })
      .then((console.log))
      .catch(function (error) {
        console.error("Error!", error);
      });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add-description", (req,res) => {
    const {name, description, imageUrl} = req.body
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
              name: name, // The name of the data entry
              value: description, // The value to store
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
});

app.get("/get-assets", (req,res) => {
    try {
        var sourceKeys = DiamSdk.Keypair.fromSecret(
            "SASOAZNU3WDAYCYLGHV2B744XCZ2YHKHBMRFPU5JXY7G5Z56NIDTYPDS"
        );
        
        var server = new DiamSdk.Horizon.Server("https://diamtestnet.diamcircle.io");
        
        server
          .loadAccount(sourceKeys.publicKey())
          .then(function (account) {
            // console.log("Account exists:", account);
            // const data = atob(account.data_attr);
            // console.log(data);
            const assets = account.balances
            assets.map((name) => {
                console.log(name.asset_code + '-' + name.balance)
            })
        })
          .catch(function (error) {
            console.error("Account not found!", error);
          });
    } catch (error) {
        console.log(error)
    }
})


app.listen(4200, () => {
  console.log("server started bitch");
});
