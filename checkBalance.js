import DiamSdk from "diamante-sdk-js"
import { pair } from "./blockchain";

const server = new DiamSdk.Horizon.Server("https://diamtestnet.diamcircle.io/");

// the JS SDK uses promises for most actions, such as retrieving an account
const account = await server.loadAccount(pair.publicKey());
console.log("Balances for account: " + pair.publicKey());
account.balances.forEach(function (balance) {
  console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
});