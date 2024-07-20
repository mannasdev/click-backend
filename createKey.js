
import DiamSdk from "diamante-sdk-js"
// create a completely new and unique pair of keys
const pair = DiamSdk.Keypair.random();

const keyPairGen = () => {
    console.log(pair.secret());
    console.log(pair.publicKey());
} 

keyPairGen();